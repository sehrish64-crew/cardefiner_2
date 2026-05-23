"use client"

import { useState } from 'react'
import Link from 'next/link'
import { X, Menu, Globe } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useCountry, countries } from '@/contexts/CountryContext'
import { useTranslations } from '@/lib/translations'

const PRIMARY = "#149544"

export default function Header() {
  const { selectedCountry, setSelectedCountry } = useCountry()
  const { t } = useTranslations()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [countryOpen, setCountryOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = countries.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const nav = [
    { href: "/", label: t('nav_home') },
    { href: "/pricing", label: t('nav_pricing') },
    { href: "/contact-us", label: t('nav_contact') },
    { href: "/about-us", label: t('nav_about') },
  ]

  return (
    <>
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">

        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" className="h-8 md:h-10" />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8 text-white/80">

            {nav.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="relative hover:text-[#149544] transition font-medium group"
              >
                {item.label}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#149544] group-hover:w-full transition-all" />
              </Link>
            ))}

          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            {/* COUNTRY */}
            <button
              onClick={() => setCountryOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 hover:border-[#149544] transition"
            >
              <Globe className="w-4 h-4 text-[#149544]" />
              <span className="text-sm text-white">
                {selectedCountry?.code}
              </span>
            </button>

            {/* MOBILE MENU BUTTON */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10"
            >
              <Menu className="text-white w-6 h-6" />
            </button>

          </div>

        </div>

        {/* bottom line */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#149544]/40 to-transparent" />

      </header>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl p-6">

          <div className="flex justify-between items-center mb-8">
            <img src="/logo.png" className="h-8" />
            <button onClick={() => setMobileOpen(false)}>
              <X className="text-white" />
            </button>
          </div>

          <div className="space-y-6 text-white text-lg">

            {nav.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block hover:text-[#149544] transition"
              >
                {item.label}
              </Link>
            ))}

          </div>

        </div>
      )}

      {/* COUNTRY MODAL */}
      {countryOpen && (
        <div className="fixed inset-0 z-[120] bg-black/60 flex items-center justify-center p-4">

          <div className="bg-black border border-white/10 rounded-2xl w-full max-w-2xl p-5">

            <Input
              placeholder="Search country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="mb-4 bg-white/5 border-white/10 text-white"
            />

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto">

              {filtered.map((c) => (
                <button
                  key={c.code}
                  onClick={() => {
                    setSelectedCountry(c)
                    setCountryOpen(false)
                  }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#149544] transition"
                >
                  <img
                    src={`https://flagcdn.com/w40/${c.countryCode}.png`}
                    className="w-5 h-4 rounded"
                  />
                  <span className="text-white text-sm">{c.name}</span>
                </button>
              ))}

            </div>

            <button
              onClick={() => setCountryOpen(false)}
              className="mt-4 text-sm text-white/60 hover:text-[#149544]"
            >
              Close
            </button>

          </div>

        </div>
      )}
    </>
  )
}