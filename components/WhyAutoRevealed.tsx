'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import GetReportForm from './GetReportForm'
import { useTranslations } from '@/lib/translations'

export default function WhyCarDefiner() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useTranslations()

  useEffect(() => setIsVisible(true), [])

  const cards = [
    { title: "Instant Check", value: "VIN + Plate", icon: "🔎" },
    { title: "Daily Reports", value: "45K+", icon: "⚡" },
    { title: "Data Sources", value: "900+", icon: "🌐" },
    { title: "Report Type", value: "Full History", icon: "📄" }
  ]

  return (
    <section className="relative py-16 md:py-28 bg-black text-white overflow-hidden">

      {/* BRAND GLOW */}
      <div className="absolute top-[-180px] left-[-180px] w-[450px] h-[450px] bg-[#149544]/25 blur-[150px]" />
      <div className="absolute bottom-[-180px] right-[-180px] w-[450px] h-[450px] bg-[#149544]/20 blur-[150px]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">

        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold">
            {t('why_title')}
          </h2>
          <p className="mt-4 text-white/60 text-sm md:text-lg">
            {t('why_subtitle')}
          </p>
        </div>

        {/* HERO SECTION */}
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* LEFT CONTENT */}
          <div className="space-y-6">

            <p className="text-[#149544] text-sm uppercase tracking-widest">
              Vehicle Intelligence Report
            </p>

            <h3 className="text-3xl md:text-5xl font-bold leading-tight">
              Full Vehicle History Check
            </h3>

            <p className="text-white/70 text-sm md:text-base">
              Instantly detect accidents, mileage rollback, ownership changes and hidden risks before buying any vehicle.
            </p>

            <div className="flex items-end gap-3">
              <span className="text-4xl md:text-6xl font-bold text-[#149544]">
                $50
              </span>
              <span className="text-white/50 text-sm mb-2">
                starting price
              </span>
            </div>

            {/* BUTTON */}
            <button
              onClick={() => setIsFormOpen(true)}
              className="px-6 py-3 bg-[#149544] text-black font-bold rounded-xl hover:bg-[#128a3d] transition"
            >
              Check VIN Now
            </button>

          </div>

          {/* RIGHT CARDS */}
          <div className="grid sm:grid-cols-2 gap-4">

            {cards.map((item, i) => (
              <div
                key={i}
                className="relative p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition"
              >

                <div className="text-xl mb-2">{item.icon}</div>

                <p className="text-xs text-white/50 uppercase">
                  {item.title}
                </p>

                <p className="text-sm md:text-lg font-bold mt-1">
                  {item.value}
                </p>

                {/* green accent line */}
                <div className="h-1 w-10 mt-3 bg-[#149544] rounded-full"></div>

              </div>
            ))}

          </div>

        </div>

        {/* TRUST SECTION */}
        <div className="mt-16 md:mt-24 rounded-3xl overflow-hidden border border-white/10">

          <div className="bg-gradient-to-r from-[#149544] via-[#128a3d] to-[#149544] p-8 md:p-14 grid md:grid-cols-2 gap-8 items-center">

            <div>
              <h3 className="text-2xl md:text-4xl font-bold">
                Trusted by 1M+ Smart Drivers
              </h3>
              <p className="text-white/80 mt-2">
                Powered by verified global vehicle data from 900+ sources.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">

              <div className="bg-white/10 p-4 rounded-xl text-center">
                <p className="text-xl font-bold">4.8★</p>
                <p className="text-xs text-white/60">Rating</p>
              </div>

              <div className="bg-white/10 p-4 rounded-xl text-center">
                <p className="text-xl font-bold">99.9%</p>
                <p className="text-xs text-white/60">Accuracy</p>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* FORM */}
      <GetReportForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </section>
  )
}