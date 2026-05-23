"use client"

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CountryProvider } from '@/contexts/CountryContext'
import LocationPopup from '@/components/LocationPopup'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  if (isAdminRoute) {
    // Ensure admin pages still have the country context available for translations
    return (
      <CountryProvider>
        {children}
      </CountryProvider>
    )
  }

  return (
    <CountryProvider>
      <LocationPopup />
      <Header />
      {children}
      <Footer />
    </CountryProvider>
  )
}
