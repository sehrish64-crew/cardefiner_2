'use client'

import { useState, useEffect, useRef } from 'react'
import { Check, Sparkles, Zap, Crown } from 'lucide-react'
import Image from 'next/image'
import { useCountry } from '@/contexts/CountryContext'
import { useTranslations } from '@/lib/translations'
import GetReportForm from '@/components/GetReportForm'

import { PRICING_MAP, CURRENCY_SYMBOLS, formatCurrency } from '@/lib/prices'

const PRIMARY = "#22c55e" // neon green

const basePricingPlans = [
  {
    name: 'Premium',
    badge: 'GOLD',
    badgeColor: 'bg-gradient-to-r from-green-400 to-cyan-400 text-black',
    priceKey: 'premium' as const,
    icon: Crown,
    popular: false,
    borderColor: 'border-white/10',
    iconBg: 'bg-white/10',
    iconColor: 'text-green-400',
    stripeLink: 'https://buy.stripe.com/9B6bIUgin1Z82zK4Fu9MY02',
    features: [
      'All Premium Features',
      'Accident Records',
      'Theft Records',
      'Salvage Records',
      'Open Recalls',
      'Odometer Readings',
      'Loan Details',
      'Market Value',
      'Specifications',
    ],
    buttonText: 'Select Plan',
  },
  {
    name: 'Basic',
    badge: 'MOST POPULAR',
    badgeColor: 'bg-gradient-to-r from-green-400 to-cyan-400 text-black',
    priceKey: 'basic' as const,
    icon: Zap,
    popular: true,
    borderColor: 'border-white/10',
    iconBg: 'bg-white/10',
    iconColor: 'text-green-400',
    stripeLink: 'https://buy.stripe.com/dRm00c3vB1Z87U46NC9MY00',
    features: [
      'Accident Records',
      'Theft Records',
      'Salvage Records',
      'Open Recalls',
      'Lease Records',
    ],
    buttonText: 'Select Plan',
  },
]

export default function PricingClient() {
  const { selectedCountry } = useCountry()
  const { t } = useTranslations()
  const [isVisible, setIsVisible] = useState(false)
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('')
  const sectionRef = useRef<HTMLDivElement>(null)

  const currencySymbol = CURRENCY_SYMBOLS[selectedCountry.currency] || '$'
  const pricing = PRICING_MAP[selectedCountry.currency] || PRICING_MAP['USD']

  const pricingPlans = basePricingPlans.map(plan => ({
    ...plan,
    price: formatCurrency(
      pricing[plan.priceKey],
      selectedCountry.currency,
      `${selectedCountry.language}-${selectedCountry.code}`
    ),
    currency: currencySymbol,
  }))

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true)
    }, { threshold: 0.1 })

    if (sectionRef.current) observer.observe(sectionRef.current)

    return () => observer.disconnect()
  }, [])

  const handleSelectPlan = (stripeLink: string) => {
    window.location.href = stripeLink
  }

  return (
    <>
      <div ref={sectionRef} className="relative bg-black overflow-hidden text-white">

        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-500/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-cyan-500/10 blur-3xl rounded-full"></div>

        <div className="relative container mx-auto px-4 py-20">

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-green-400" />
              <span className="text-sm font-semibold text-gray-300">
                Simple & Transparent Pricing
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold">
              <span className="text-green-400">Choose</span>{' '}
              <span className="text-cyan-400">Your Plan</span>
            </h1>

            <p className="mt-4 text-gray-400 text-lg">
              Get instant vehicle history reports with trusted data sources.
            </p>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-2 gap-8">

            {pricingPlans.map((plan, i) => (
              <div
                key={i}
                onMouseEnter={() => setHoveredPlan(i)}
                onMouseLeave={() => setHoveredPlan(null)}
                className={`relative rounded-2xl border bg-white/5 backdrop-blur-lg transition-all duration-300
                ${hoveredPlan === i ? 'shadow-[0_0_40px_rgba(0,255,150,0.25)] scale-105' : 'shadow-md'}
                ${plan.borderColor}`}
              >

                <div className={`absolute top-0 left-0 px-3 py-1 text-xs font-bold ${plan.badgeColor}`}>
                  {plan.badge}
                </div>

                <div className="p-8 text-center">

                  <div className={`w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-4 ${plan.iconBg}`}>
                    <plan.icon className={`w-7 h-7 ${plan.iconColor}`} />
                  </div>

                  <h3 className="text-2xl font-bold text-white">{plan.name}</h3>

                  <div className="mt-4">
                    <span className="text-xl text-gray-400">{plan.currency}</span>
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                  </div>

                  <p className="text-sm text-gray-500 mt-2">One-time payment</p>

                  <div className="mt-6 space-y-2 text-left">
                    {plan.features.map((f, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-gray-300">{f}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => handleSelectPlan(plan.stripeLink)}
                    className={`mt-6 w-full py-3 rounded-xl font-semibold transition-all
                    ${plan.popular 
                      ? 'bg-gradient-to-r from-green-400 to-cyan-400 text-black shadow-[0_0_20px_rgba(0,255,150,0.4)] hover:scale-105'
                      : 'bg-white/10 text-white hover:bg-white/20'}
                    `}
                  >
                    {plan.buttonText}
                  </button>

                </div>
              </div>
            ))}

          </div>

          {/* Note */}
          <div className="text-center mt-12 text-gray-400 text-sm space-y-2">
            <p>✔ One-time payment only — no subscriptions</p>
            <p>✔ 14-day money-back guarantee</p>
            <p>✔ Instant digital delivery</p>
          </div>

        </div>
      </div>

      <GetReportForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        preselectedPackage={selectedPlan}
      />
    </>
  )
}