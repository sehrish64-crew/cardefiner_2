"use client"

import { useEffect, useRef, useState } from 'react'
import { Headset, MessageCircle, Clock, ShieldCheck } from 'lucide-react'

const stats = [
  {
    value: '24/7',
    label: 'Email Support Available',
    icon: Clock,
  },
  {
    value: '4.9/5',
    label: 'Customer Rating',
    icon: ShieldCheck,
  },
  {
    value: '10m',
    label: 'Average Reply Time',
    icon: MessageCircle,
  },
]

export default function Support() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.1 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => ref.current && observer.unobserve(ref.current)
  }, [])

  return (
    <section
      ref={ref}
      className="relative py-24 overflow-hidden bg-black text-white"
    >
      {/* GLOW */}
      <div className="absolute top-[-120px] left-[-120px] w-[500px] h-[500px] bg-green-500/20 blur-[140px]" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[500px] h-[500px] bg-blue-500/20 blur-[140px]" />

      <div className="relative max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT CONTENT */}
        <div className="space-y-6">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm">
            <Headset className="w-4 h-4 text-green-400" />
            24/7 Expert Support Team
          </div>

          <h2 className="text-3xl md:text-5xl font-bold leading-tight">
            Need help with your <span className="text-green-400">vehicle report?</span>
          </h2>

          <p className="text-white/70 text-sm md:text-base">
            Our experts are always available to help you understand vehicle history, reports, and data insights instantly.
          </p>

          {/* CTA */}
          <div className="flex flex-wrap gap-3">
            <button className="px-5 py-3 bg-green-500 text-black font-bold rounded-xl hover:bg-green-400 transition">
              Contact Support
            </button>

            <button className="px-5 py-3 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition">
              Live Chat
            </button>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-3 gap-3 pt-4">

            {stats.map((s, i) => (
              <div
                key={i}
                className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl p-4 text-center"
              >
                <s.icon className="w-5 h-5 mx-auto mb-2 text-green-400" />
                <div className="font-bold text-lg">{s.value}</div>
                <div className="text-xs text-white/60">{s.label}</div>
              </div>
            ))}

          </div>

        </div>

        {/* RIGHT VISUAL */}
        <div className="relative">

          {/* MAIN IMAGE */}
          <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1553877522-43269d4ea984"
              className="w-full h-[420px] object-cover"
            />
          </div>

          {/* FLOAT CARD */}
          <div className="absolute bottom-6 left-6 right-6 backdrop-blur-xl bg-black/50 border border-white/20 rounded-2xl p-4 flex items-center gap-3">

            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-black" />
            </div>

            <div>
              <p className="text-sm font-semibold">Live Support Online</p>
              <p className="text-xs text-white/60">We typically reply in under 10 minutes</p>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}