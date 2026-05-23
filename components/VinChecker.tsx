"use client"

import { useState, useEffect, useRef } from 'react'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import GetReportForm from './GetReportForm'
import { useTranslations } from '@/lib/translations'

const trustLogos = [
  { name: 'AutoBild' },
  { name: 'TopGear' },
  { name: 'Forbes' },
  { name: 'REUTERS' },
]

export default function VinChecker() {
  const [vin, setVin] = useState('')
  const [vehicleIdType, setVehicleIdType] = useState<'vin' | 'plate'>('vin')
  const [plate, setPlate] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const { t } = useTranslations()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => sectionRef.current && observer.unobserve(sectionRef.current)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-24 px-4 overflow-hidden bg-black"
    >
      <div className="max-w-6xl mx-auto">

        {/* MAIN CARD */}
        <div className={`relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-700
          ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>

          {/* BACKGROUND */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-black to-blue-600" />
          <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.08)_1px,_transparent_1px)] [background-size:20px_20px]" />

          <div className="relative grid lg:grid-cols-2 gap-10 p-6 md:p-12">

            {/* LEFT CONTENT */}
            <div className="text-white space-y-5 text-center lg:text-left">

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-snug">
                Instantly uncover full vehicle history before you buy
              </h2>

              <p className="text-white/80 text-sm md:text-base">
                Check accident history, mileage tampering, ownership changes and hidden issues in seconds.
              </p>

              <div className="flex items-center justify-center lg:justify-start gap-2 text-sm text-white/90">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Trusted by 4.5M+ users worldwide
              </div>

              {/* TRUST LOGOS */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 pt-2">
                {trustLogos.map((logo, i) => (
                  <div
                    key={i}
                    className="px-3 py-1 rounded-md bg-white/10 border border-white/20 text-xs text-white/80"
                  >
                    {logo.name}
                  </div>
                ))}
              </div>

            </div>

            {/* RIGHT FORM */}
      {/* RIGHT FORM */}
<div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-5 md:p-6 shadow-2xl">

  {/* TOGGLE */}
  <div className="flex w-full bg-white/10 border border-white/20 p-1 rounded-full mb-4">

    <button
      onClick={() => setVehicleIdType('vin')}
      className={`w-1/2 py-2 text-sm rounded-full transition font-medium ${
        vehicleIdType === 'vin'
          ? 'bg-white text-black shadow'
          : 'text-white/70'
      }`}
    >
      VIN
    </button>

    <button
      onClick={() => setVehicleIdType('plate')}
      className={`w-1/2 py-2 text-sm rounded-full transition font-medium ${
        vehicleIdType === 'plate'
          ? 'bg-white text-black shadow'
          : 'text-white/70'
      }`}
    >
      Plate
    </button>

  </div>

  {/* INPUT */}
  <Input
    placeholder={vehicleIdType === 'vin' ? "Enter VIN Number" : "Enter Plate Number"}
    value={vehicleIdType === 'vin' ? vin : plate}
    onChange={(e) =>
      vehicleIdType === 'vin'
        ? setVin(e.target.value.toUpperCase())
        : setPlate(e.target.value.toUpperCase())
    }
    className="h-12 text-base bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:bg-white/15"
  />

  {/* BUTTON */}
  <Button
    onClick={() => setIsFormOpen(true)}
    className="w-full mt-4 h-12 bg-green-500 hover:bg-green-600 text-black font-bold"
  >
    Get Report
  </Button>

  <p className="text-xs text-white/60 text-center mt-3">
    Powered by Vehicle Intelligence Engine
  </p>

</div>

          </div>

          {/* BOTTOM GLOW LINE */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
      </div>

      <GetReportForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </section>
  )
}