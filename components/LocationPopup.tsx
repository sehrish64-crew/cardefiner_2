"use client"

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCountry, countries } from '@/contexts/CountryContext'
import { X, MapPin, Search, Globe, Zap } from 'lucide-react'

export default function LocationPopup() {
  const { selectedCountry, setSelectedCountry } = useCountry()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredCountries, setFilteredCountries] = useState(countries)
  const [isHydrated, setIsHydrated] = useState(false)

  // Check if this is the user's first visit (client-side only)
  useEffect(() => {
    setIsHydrated(true)
    
    // Allow forcing the popup open with ?showLocationPopup=true for testing
    const forceShow = searchParams?.get('showLocationPopup') === 'true'
    
    // Only check localStorage after hydration
    if (typeof window !== 'undefined') {
      const hasVisited = localStorage.getItem('locationPopupShown')
      
      // Debug logging
      console.log('[LocationPopup] Hydrated - checking first visit...')
      console.log('[LocationPopup] hasVisited:', hasVisited)
      console.log('[LocationPopup] forceShow:', forceShow)
      
      if (!hasVisited || forceShow) {
        // Show popup on first visit or if forced
        console.log('[LocationPopup] Showing popup')
        setIsOpen(true)
        if (!forceShow) {
          localStorage.setItem('locationPopupShown', 'true')
          console.log('[LocationPopup] Set locationPopupShown flag')
        }
      } else {
        console.log('[LocationPopup] User has already visited, skipping popup')
      }
    }
  }, [searchParams])

  // Filter countries based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCountries(countries)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredCountries(
        countries.filter(country =>
          country.name.toLowerCase().includes(query) ||
          country.code.toLowerCase().includes(query) ||
          country.currency.toLowerCase().includes(query)
        )
      )
    }
  }, [searchQuery])

  const handleSelectCountry = (country: typeof countries[0]) => {
    setSelectedCountry(country)
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-gray-900 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in scale-in duration-300 border border-green-500/30">
        {/* Animated Header Background */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-600 via-green-500 to-green-600">
          <div className="absolute inset-0 opacity-10 overflow-hidden">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-green-500 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-green-400 rounded-full blur-3xl"></div>
          </div>
          
          {/* Header Content */}
          <div className="relative z-10 p-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">Choose Your Region</h2>
                <p className="text-white/80 text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Instant currency & language adjustment
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 text-white hover:scale-110"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Search Box with Enhanced Styling */}
        <div className="p-6 border-b border-green-500/20 bg-gray-800">
          <div className="relative group">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-green-500/60 group-focus-within:text-green-400 transition duration-200" />
            <input
              type="text"
              placeholder="Search countries, codes, or currencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-3 border-2 border-green-500/30 rounded-xl focus:outline-none focus:border-green-400 focus:ring-4 focus:ring-green-500/20 transition-all duration-200 text-white placeholder-gray-400 bg-gray-900"
              autoFocus
            />
          </div>
        </div>

        {/* Countries Grid with Enhanced Empty State */}
        <div className="overflow-y-auto flex-1 bg-gray-900">
          {filteredCountries.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-6">
              {filteredCountries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => handleSelectCountry(country)}
                  className={`group p-4 rounded-xl transition-all duration-200 text-left border-2 ${
                    selectedCountry.code === country.code
                      ? 'bg-gradient-to-br from-green-600 to-green-500 text-white border-green-400/50 shadow-lg scale-105'
                      : 'bg-gray-800 text-gray-100 border-green-500/20 hover:border-green-500/50 hover:shadow-md hover:scale-102'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-bold text-lg">{country.name}</div>
                    {selectedCountry.code === country.code && (
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-white/30 rounded-full">
                        <Zap className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                  <div className={`text-sm font-semibold mb-1 ${selectedCountry.code === country.code ? 'text-white/80' : 'text-green-400'}`}>
                    {country.currency}
                  </div>
                  <div className={`text-xs ${selectedCountry.code === country.code ? 'text-white/60' : 'text-gray-400'}`}>
                    One Time Payment
                  </div>
                  <div className={`text-xs mt-2 font-semibold ${selectedCountry.code === country.code ? 'text-white/80' : 'text-gray-300'}`}>
                    {country.code}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <Globe className="w-12 h-12 text-gray-600 mb-4" />
              <p className="text-lg font-semibold text-gray-400">No countries found</p>
              <p className="text-sm text-gray-500 mt-1">Try searching with a different term</p>
            </div>
          )}
        </div>

        {/* Enhanced Footer */}
        <div className="border-t border-green-500/20 p-6 bg-gray-800 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-1">Currently Selected</p>
            <p className="text-lg font-bold text-green-400">{selectedCountry.name} ({selectedCountry.code})</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold flex items-center gap-2 group"
          >
            <span>Continue</span>
            <Zap className="w-4 h-4 group-hover:rotate-12 transition duration-200" />
          </button>
        </div>
      </div>
    </div>
  )
}
