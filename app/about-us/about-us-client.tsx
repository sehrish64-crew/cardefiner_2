'use client'

import { useState, useEffect } from 'react'
import {
  Shield, Users, Globe2, CheckCircle2, Database, Clock,
  Award, Heart, Zap, Eye
} from 'lucide-react'
import Image from 'next/image'

const PRIMARY = "#22c55e" // neon green

const stats = [
  { value: 900, suffix: '+', label: 'Data Sources Worldwide', icon: Database },
  { value: 5, suffix: 'M+', label: 'Vehicle Reports Delivered', icon: CheckCircle2 },
  { value: 50, suffix: '+', label: 'Countries Supported', icon: Globe2 },
  { value: 24, suffix: '/7', label: 'Customer Support', icon: Clock }
]

const values = [
  {
    icon: Shield,
    title: 'Reliable & Verified Vehicle Data',
    description:
      'We source vehicle information from trusted global databases to ensure every report is accurate, verified, and continuously updated for your peace of mind.'
  },
  {
    icon: Users,
    title: 'Designed for Buyers & Sellers',
    description:
      'Our platform empowers both buyers and sellers with full transparency, helping them make safe, confident, and informed decisions every time.'
  },
  {
    icon: Eye,
    title: 'Complete Transparency Report',
    description:
      'We uncover full vehicle history including accidents, mileage records, ownership changes, and hidden issues before you make a purchase.'
  },
  {
    icon: Zap,
    title: 'Instant Digital Reports',
    description:
      'Get fast, real-time vehicle reports powered by advanced systems so you never have to wait when making important decisions.'
  }
]

export default function AboutUsClient() {
  const [isVisible, setIsVisible] = useState(false)
  const [counters, setCounters] = useState([0, 0, 0, 0])

  useEffect(() => {
    setIsVisible(true)

    const duration = 1800
    const steps = 60
    const interval = duration / steps

    stats.forEach((stat, index) => {
      let current = 0
      const inc = stat.value / steps

      const timer = setInterval(() => {
        current += inc
        if (current >= stat.value) {
          current = stat.value
          clearInterval(timer)
        }

        setCounters(prev => {
          const updated = [...prev]
          updated[index] = Math.floor(current)
          return updated
        })
      }, interval)
    })
  }, [])

  return (
    <div className="bg-black text-white">

      {/* HERO */}
      <div className="relative overflow-hidden">

        {/* Glow */}
        <div className="absolute -top-20 left-10 w-96 h-96 bg-green-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 py-20 text-center max-w-4xl relative">

          <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 text-green-400 font-semibold border border-white/10">
            <Shield size={16} /> About cardefiner
          </span>

          <h1 className="text-4xl md:text-6xl font-extrabold mt-6 leading-tight">
            Driving <span className="text-green-400">Trust</span> Through Vehicle Data
          </h1>

          <p className="text-gray-400 mt-5 text-lg">
            cardefiner is a digital vehicle history platform powered by billions of verified records from 900+ global databases. We provide instant access to comprehensive vehicle reports including ownership history, accident records, odometer readings, title information, damage assessment, and theft records.
          </p>

        </div>
      </div>

      {/* STATS */}
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

          {stats.map((s, i) => (
            <div
              key={i}
              className="group bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center shadow-md hover:shadow-[0_0_30px_rgba(0,255,150,0.2)] transition-all"
            >
              <div className="w-12 h-12 mx-auto rounded-xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition">
                <s.icon className="text-green-400" />
              </div>

              <h2 className="text-3xl font-bold mt-3 text-white">
                {counters[i]}{s.suffix}
              </h2>

              <p className="text-sm text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}

        </div>
      </div>

      {/* STORY */}
      <div className="py-16">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10 items-center">

          <div className="space-y-5">

            <h2 className="text-3xl md:text-5xl font-bold">
              Why We Built <span className="text-green-400">cardefiner</span>
            </h2>

            <p className="text-gray-400 leading-relaxed">
              Buying a used car can be risky. Hidden accidents, mileage fraud, and incomplete history often lead to financial loss.
            </p>

            <p className="text-gray-400">
              Our platform gives you instant access to verified vehicle history reports so you can avoid scams and make confident decisions.
            </p>

            <div className="flex gap-4 pt-2">
              <div className="flex items-center gap-2 text-gray-300">
                <Award className="text-green-400" /> Trusted Reports
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <Heart className="text-green-400" /> User Focused
              </div>
            </div>

          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-green-500/10 rounded-3xl blur-2xl"></div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <Image
                src="/about-car.jpg"
                alt="About"
                width={800}
                height={500}
                className="object-cover"
              />

              <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 p-6 text-white">
                <h3 className="text-xl font-bold">Global Vehicle Intelligence</h3>
                <p className="text-sm text-white/70">
                  Accurate data • Real-time reports • Trusted insights
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* VALUES */}
      <div className="container mx-auto px-4 py-20">

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold">
            Our <span className="text-green-400">Core Values</span>
          </h2>
          <p className="text-gray-400 mt-3">
            The principles that define how we build trust and deliver value
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {values.map((v, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border bg-white/5 backdrop-blur-lg border-white/10 hover:shadow-[0_0_30px_rgba(0,255,150,0.2)] transition"
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                <v.icon className="text-green-400" />
              </div>

              <h3 className="text-xl font-bold text-white">{v.title}</h3>
              <p className="text-gray-400 mt-2">{v.description}</p>
            </div>
          ))}

        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-green-400 to-cyan-400 py-16 text-center text-black">

        <h2 className="text-3xl md:text-5xl font-bold">
          Start Your Vehicle Check Today
        </h2>

        <p className="text-black/70 mt-3">
          Get instant reports and protect yourself from risky car purchases
        </p>

        <button className="mt-6 bg-black text-white hover:bg-white hover:text-black font-bold px-8 py-3 rounded-xl transition-all">
          Get Report Now
        </button>

      </div>

    </div>
  )
}