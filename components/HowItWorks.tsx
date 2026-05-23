"use client"

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from '@/lib/translations'

export default function HowItWorks() {
  const { t } = useTranslations()
  const [visibleSteps, setVisibleSteps] = useState<number[]>([])
  const sectionRef = useRef<HTMLDivElement>(null)

  const steps = [
    {
      number: '01',
      titleKey: 'howitworks_step1_title',
      descKey: 'howitworks_step1_desc',
      linkKey: 'howitworks_step1_link',
    },
    {
      number: '02',
      titleKey: 'howitworks_step2_title',
      descKey: 'howitworks_step2_desc',
      linkKey: 'howitworks_step2_link',
    },
    {
      number: '03',
      titleKey: 'howitworks_step3_title',
      descKey: 'howitworks_step3_desc',
      linkKey: 'howitworks_step3_link',
    },
    {
      number: '04',
      titleKey: 'howitworks_step4_title',
      descKey: 'howitworks_step4_desc',
      linkKey: 'howitworks_step4_link',
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          steps.forEach((_, i) => {
            setTimeout(() => {
              setVisibleSteps((prev) => [...prev, i])
            }, i * 180)
          })
          observer.disconnect()
        }
      })
    }, { threshold: 0.2 })

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-28 bg-black text-white overflow-hidden"
    >

      {/* glow */}
      <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-[#149544]/20 blur-[140px]" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-[#149544]/10 blur-[140px]" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">

        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">

          <h2 className="text-3xl md:text-5xl font-bold">
            {t('howitworks_title')}
          </h2>

          <p className="text-white/70 mt-4 text-sm md:text-lg">
            {t('howitworks_subtitle')}
          </p>

        </div>

        {/* STEPS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">

          {steps.map((step, i) => {
            const show = visibleSteps.includes(i)

            return (
              <div
                key={i}
                className={`
                  relative p-6 md:p-8 rounded-2xl
                  border border-white/10
                  bg-gradient-to-br from-white/5 to-[#149544]/5
                  backdrop-blur-xl
                  transition-all duration-700
                  ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}
                `}
              >

                {/* step number */}
                <div className="flex items-center gap-4 mb-4">

                  <div className="w-12 h-12 rounded-xl bg-[#149544]/15 text-[#149544] flex items-center justify-center font-bold">
                    {step.number}
                  </div>

                  <h3 className="text-lg md:text-xl font-bold">
                    {t(step.titleKey)}
                  </h3>

                </div>

                <p className="text-white/70 text-sm md:text-base leading-relaxed mb-5">
                  {t(step.descKey)}
                </p>

                <a
                  href="#"
                  className="inline-flex items-center gap-2 text-[#149544] font-semibold hover:text-white transition"
                >
                  {t(step.linkKey)}
                  <ArrowRight className="w-4 h-4" />
                </a>

                {/* glow line */}
                <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition bg-[#149544]/5" />

              </div>
            )
          })}

        </div>

        {/* CTA */}
        <div className="text-center mt-14 md:mt-20">

          <Link
            href="/pricing"
            className="
              inline-flex items-center gap-2
              px-7 py-3 rounded-xl
              bg-[#149544] text-black font-bold
              hover:bg-[#0f7a38] transition
              hover:scale-105
            "
          >
            {t('howitworks_cta')}
            <ArrowRight className="w-5 h-5" />
          </Link>

        </div>

      </div>
    </section>
  )
}