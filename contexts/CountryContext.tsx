"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Country {
  code: string
  name: string
  countryCode: string
  currency: string
  language: string
}

import countriesList from '@/lib/countries'

export const countries: Country[] = countriesList


interface CountryContextType {
  selectedCountry: Country
  setSelectedCountry: (country: Country) => void
}

const CountryContext = createContext<CountryContextType | undefined>(undefined)

export function CountryProvider({ children }: { children: ReactNode }) {
  const [selectedCountry, setSelectedCountryState] = useState<Country>(
    countries.find(c => c.code === 'US') || countries[0]
  )

  if (process.env.NODE_ENV !== 'production') {
    // quick debug: how many countries are available
    console.log('[i18n] Loaded countries count:', countries.length)
  }

  // Restore persisted country selection on mount
  useEffect(() => {
    try {
      const savedCode = typeof window !== 'undefined' ? localStorage.getItem('selectedCountryCode') : null
      if (savedCode) {
        const found = countries.find(c => c.code === savedCode)
        if (found) setSelectedCountryState(found)
      }

      // Ensure the server can read the current language via cookie
      const lang = (savedCode && countries.find(c => c.code === savedCode)?.language) || selectedCountry.language
      document.cookie = `cv_locale=${lang}; path=/; max-age=${60 * 60 * 24 * 365}`
    } catch (e) {
      // ignore localStorage / cookie errors
    }
  }, [])

  const setSelectedCountry = (country: Country) => {
    setSelectedCountryState(country)
    try {
      localStorage.setItem('selectedCountryCode', country.code)
      // Also write a cookie so server-rendered pages can pick up the selected language
      document.cookie = `cv_locale=${country.language}; path=/; max-age=${60 * 60 * 24 * 365}`
    } catch (e) {
      // ignore localStorage / cookie errors
    }
    // Dev log to help debugging language switching
    if (process.env.NODE_ENV !== 'production') {
      console.log('[i18n] Selected country:', country.code, 'language:', country.language)
    }
  }

  return (
    <CountryContext.Provider value={{ selectedCountry: selectedCountry, setSelectedCountry }}>
      {children}
    </CountryContext.Provider>
  )
}

export function useCountry() {
  const context = useContext(CountryContext)
  if (context === undefined) {
    throw new Error('useCountry must be used within a CountryProvider')
  }
  return context
}
