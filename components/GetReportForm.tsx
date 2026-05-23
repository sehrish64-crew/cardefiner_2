'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, HelpCircle, Key, Hash, Crown, Zap } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCountry } from '@/contexts/CountryContext'
import countriesList from '@/lib/countries'
import { Input as TextInput } from '@/components/ui/input'
import { useTranslations } from '@/lib/translations'
import { parseJsonSafe } from '@/lib/utils'
import { getPrice, formatCurrency, getExternalPriceId, getPaddlePriceId } from '@/lib/prices'

interface GetReportFormProps {
  isOpen: boolean
  onClose: () => void
  preselectedPackage?: string
  prefilledIdentType?: 'vin' | 'plate'
  prefilledIdentValue?: string
}

const vehicleTypes = ['Car', 'Motorcycle', 'Truck', 'Boat', 'ATV', 'Campervan']
const packages = [
  { id: 'basic', name: 'Basic Report', stripeLink: 'https://buy.stripe.com/dRm00c3vB1Z87U46NC9MY00' },
  { id: 'premium', name: 'Premium Report', stripeLink: 'https://buy.stripe.com/9B6bIUgin1Z82zK4Fu9MY02' },
]

export default function GetReportForm({ isOpen, onClose, preselectedPackage, prefilledIdentType, prefilledIdentValue }: GetReportFormProps) {
  const { selectedCountry, setSelectedCountry } = useCountry()
  const [step, setStep] = useState<'form' | 'plan'>('form')
  const [vehicleIdType, setVehicleIdType] = useState<'vin' | 'plate'>('vin')
  const [vehicleType, setVehicleType] = useState('')
  const [vinNumber, setVinNumber] = useState('')
  const [plateNumber, setPlateNumber] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [selectedPackage, setSelectedPackage] = useState(preselectedPackage || '')
  const [selectedCountryCode, setSelectedCountryCode] = useState(selectedCountry?.code || 'US')
  const [countryFilter, setCountryFilter] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Pre-fill package
  useEffect(() => { if (preselectedPackage) setSelectedPackage(preselectedPackage) }, [preselectedPackage])
  useEffect(() => { if (prefilledIdentType && prefilledIdentValue) { setVehicleIdType(prefilledIdentType); prefilledIdentType === 'vin' ? setVinNumber(prefilledIdentValue.toUpperCase()) : setPlateNumber(prefilledIdentValue.toUpperCase()) } }, [prefilledIdentType, prefilledIdentValue])
  useEffect(() => { if (selectedCountry && selectedCountry.code !== selectedCountryCode) setSelectedCountryCode(selectedCountry.code) }, [selectedCountry])

  // Reset step when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('form')
      setError('')
    }
  }, [isOpen])

  const validateFormStep = () => {
    setError('')
    if (!vehicleType) return setError('Select vehicle type'), false
    if (vehicleIdType === 'vin' && !vinNumber) return setError('Enter VIN'), false
    if (vehicleIdType === 'plate' && !plateNumber) return setError('Enter plate number'), false
    if (!customerEmail) return setError('Enter email'), false
    return true
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateFormStep()) return
    setStep('plan')
    setError('')
  }

  const handlePlanSubmit = async () => {
    if (!selectedPackage) {
      setError('Select a plan to continue')
      return
    }

    setIsSubmitting(true)
    try {
      const packageData = packages.find(p => p.id === selectedPackage)
      
      if (!packageData || !packageData.stripeLink) {
        throw new Error('Invalid package selected')
      }

      const price = getPrice(selectedPackage as any, selectedCountry.currency)

      // Step 1: Create order in database
      const orderResponse = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_email: customerEmail,
          vehicle_type: vehicleType,
          identification_type: vehicleIdType,
          identification_value: vehicleIdType === 'vin' ? vinNumber : plateNumber,
          vin_number: vehicleIdType === 'vin' ? vinNumber : null,
          package_type: selectedPackage,
          country_code: selectedCountryCode,
          currency: selectedCountry.currency,
          amount: price,
          paymentProvider: 'stripe',
        }),
      })

      let orderId = null
      if (orderResponse.ok) {
        const orderData = await orderResponse.json()
        orderId = orderData.orderId
        console.log('✅ Order created:', orderId)
      } else {
        console.warn('Failed to create order, but proceeding to payment')
      }

      // Step 2: Send user data to backend/email
      const response = await fetch('/api/send-report-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerEmail,
          vehicleType,
          identificationType: vehicleIdType,
          identificationValue: vehicleIdType === 'vin' ? vinNumber : plateNumber,
          selectedPackage,
          country: selectedCountryCode,
          currency: selectedCountry.currency,
          price,
          orderId,
        }),
      })

      if (!response.ok) {
        console.warn('Failed to send report request, but proceeding to payment')
      }

      // Step 3: Redirect to Stripe payment link
      if (typeof window !== 'undefined') {
        // Store order ID in sessionStorage so we can reference it after payment
        if (orderId) {
          sessionStorage.setItem('pendingOrderId', String(orderId))
        }
        window.location.href = packageData.stripeLink
        return
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to process payment. Please try again.'
      setError(errorMessage)
      console.error('❌ Error:', errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[9998]" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-900 z-[9999] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-green-500/30">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-green-400">
              {step === 'form' ? 'Vehicle Information' : 'Select Your Plan'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Step indicators */}
          <div className="flex items-center gap-4 mb-8">
            <div className={`flex-1 h-1 rounded-full transition-colors ${step === 'form' || step === 'plan' ? 'bg-green-500' : 'bg-gray-700'}`} />
            <span className="text-xs font-semibold text-gray-400">Step 1/2</span>
            <div className={`flex-1 h-1 rounded-full transition-colors ${step === 'plan' ? 'bg-green-500' : 'bg-gray-700'}`} />
            <span className="text-xs font-semibold text-gray-400">Step 2/2</span>
            <div className={`flex-1 h-1 rounded-full transition-colors ${step === 'plan' ? 'bg-green-500' : 'bg-gray-700'}`} />
          </div>

          {/* Step 1: Form */}
          {step === 'form' && (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div>
                <Label className="block text-sm font-semibold text-gray-100 mb-2">
                  Search By
                </Label>
                <div className="inline-flex items-center bg-gray-800 rounded-full p-1 gap-1 border border-green-500/20">
                  <button
                    type="button"
                    onClick={() => setVehicleIdType('vin')}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all ${
                      vehicleIdType === 'vin'
                        ? 'bg-green-600 text-white shadow'
                        : 'text-gray-300 hover:bg-gray-700/80'
                    }`}
                  >
                    <Key className="w-4 h-4" />
                    <span className="text-sm font-medium">By VIN</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setVehicleIdType('plate')}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full transition-all ${
                      vehicleIdType === 'plate'
                        ? 'bg-green-600 text-white shadow'
                        : 'text-gray-300 hover:bg-gray-700/80'
                    }`}
                  >
                    <Hash className="w-4 h-4" />
                    <span className="text-sm font-medium">By Plate</span>
                  </button>
                </div>
              </div>

              {vehicleIdType === 'vin' ? (
                <div>
                  <Label htmlFor="vin" className="block text-sm font-semibold text-gray-100 mb-2">
                    VIN Number
                  </Label>
                  <div className="relative">
                    <Input
                      id="vin"
                      type="text"
                      value={vinNumber}
                      onChange={(e) => setVinNumber(e.target.value.toUpperCase())}
                      placeholder="Enter VIN number"
                      required
                      className="h-12 pr-10 bg-gray-800 border-green-500/30 text-white placeholder-gray-500"
                      maxLength={17}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-400"
                    >
                      <HelpCircle className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Enter your 17-character Vehicle Identification Number
                  </p>
                </div>
              ) : (
                <div>
                  <Label
                    htmlFor="plate"
                    className="block text-sm font-semibold text-gray-100 mb-2"
                  >
                    Plate Number
                  </Label>
                  <Input
                    id="plate"
                    type="text"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value.toUpperCase())}
                    placeholder="Enter Plate Number"
                    required
                    className="h-12 bg-gray-800 border-green-500/30 text-white placeholder-gray-500"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Enter your vehicle&apos;s license plate number
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="vehicleType" className="block text-sm font-semibold text-gray-100 mb-2">
                  Vehicle Type
                </Label>
                <Select value={vehicleType} onValueChange={setVehicleType}>
                  <SelectTrigger className="h-12 bg-gray-800 border-green-500/30 text-white">
                    <SelectValue placeholder="Select vehicle type" />
                  </SelectTrigger>
                  <SelectContent className="z-[10000] bg-gray-800 border-green-500/30">
                    {vehicleTypes.map((type) => (
                      <SelectItem key={type} value={type} className="text-white">
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="email" className="block text-sm font-semibold text-gray-100 mb-2">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                  className="h-12 bg-gray-800 border-green-500/30 text-white placeholder-gray-500"
                />
              </div>

              <div>
                <Label className="block text-sm font-semibold text-gray-100 mb-2">Country</Label>
                <Select
                  value={selectedCountryCode}
                  onValueChange={(v) => {
                    setSelectedCountryCode(v)
                    const found = countriesList.find((c) => c.code === v)
                    if (found) setSelectedCountry(found)
                  }}
                >
                  <SelectTrigger className="h-12 bg-gray-800 border-green-500/30 text-white">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent className="z-[10000] max-h-60 overflow-auto bg-gray-800 border-green-500/30">
                    <div className="p-2">
                      <TextInput
                        value={countryFilter}
                        onChange={(e) => setCountryFilter(e.target.value)}
                        placeholder="Search countries"
                        className="mb-2 h-9 bg-gray-900 border-green-500/30 text-white placeholder-gray-500"
                      />
                    </div>
                    {countriesList
                      .filter(
                        (c) =>
                          c.name.toLowerCase().includes(countryFilter.toLowerCase()) ||
                          c.code.toLowerCase().includes(countryFilter.toLowerCase())
                      )
                      .map((c) => (
                        <SelectItem key={c.code} value={c.code} className="text-white">
                          {c.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 h-12 bg-gray-800 border-green-500/30 text-gray-100 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white"
                >
                  Next: Select Plan
                </Button>
              </div>
            </form>
          )}

          {/* Step 2: Plan Selection */}
          {step === 'plan' && (
            <div className="space-y-6">
              <div className="space-y-4">
                {packages.map((pkg) => (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
                      selectedPackage === pkg.id
                        ? 'bg-green-600/20 border-green-500 shadow-lg'
                        : 'bg-gray-800 border-green-500/20 hover:border-green-500/50 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-lg text-green-400 flex items-center gap-2">
                          {pkg.id === 'basic' ? <Zap className="w-5 h-5" /> : <Crown className="w-5 h-5" />}
                          {pkg.name}
                        </div>
                        <div className="text-sm text-gray-400 mt-2">
                          {pkg.id === 'basic' 
                            ? 'Essential vehicle history check' 
                            : 'Complete vehicle history with advanced details'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">
                          {formatCurrency(
                            getPrice(pkg.id as any, selectedCountry.currency),
                            selectedCountry.currency
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {error && (
                <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('form')}
                  className="flex-1 h-12 bg-gray-800 border-green-500/30 text-gray-100 hover:bg-gray-700"
                  disabled={isSubmitting}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handlePlanSubmit}
                  className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white"
                  disabled={isSubmitting || !selectedPackage}
                >
                  {isSubmitting
                    ? 'Processing...'
                    : `Confirm & Pay - ${
                        selectedPackage
                          ? formatCurrency(
                              getPrice(selectedPackage as any, selectedCountry.currency),
                              selectedCountry.currency
                            )
                          : '$0'
                      }`}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

