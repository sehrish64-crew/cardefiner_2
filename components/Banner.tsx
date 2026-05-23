"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Key, Hash, Loader, ShieldCheck, AlertTriangle, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import GetReportForm from './GetReportForm'
import { useTranslations } from '@/lib/translations'

export default function Banner() {
  const [vin, setVin] = useState('')
  const [vehicleIdType, setVehicleIdType] = useState<'vin' | 'plate' | null>(null)
  const [plateNumber, setPlateNumber] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const { t } = useTranslations()

  useEffect(() => {
    setVehicleIdType('vin')
  }, [])

  const handleSubmit = () => setIsFormOpen(true)

  return (
    <section className="relative py-16 md:py-24 bg-black text-white overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <div className="absolute top-[-120px] left-[-120px] w-[600px] h-[600px] bg-green-500/20 blur-[160px]" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[600px] h-[600px] bg-blue-500/20 blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.04)_1px,_transparent_1px)] [background-size:30px_30px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4">

        {/* BADGES */}
        <div className="flex justify-center gap-3 flex-wrap mb-6">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full text-xs text-white/70">
            <ShieldCheck className="w-4 h-4 text-green-400" />
            Verified Data
          </div>

          <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full text-xs text-white/70">
            <FileText className="w-4 h-4 text-green-400" />
            900+ Sources
          </div>

          <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full text-xs text-white/70">
            <AlertTriangle className="w-4 h-4 text-green-400" />
            Accident Check
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">

          {/* LEFT */}
          <div className="space-y-6 text-center md:text-left">

            <h2 className="text-3xl font-bold">
              Why check your vehicle?
            </h2>

            <div className="space-y-3 text-sm text-gray-300">
              <p>✔ Detect hidden accident history</p>
              <p>✔ Verify mileage authenticity</p>
              <p>✔ Check ownership transfers</p>
              <p>✔ Market value estimation</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
              <p className="text-xs text-gray-400">Average saved cost</p>
              <p className="text-green-400 text-2xl font-bold">$1,200+</p>
            </div>

          </div>

          {/* CENTER CAR */}
          <div className="relative flex justify-center items-center mt-10 md:mt-16">

            {/* GLOW */}
            <div className="absolute w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-green-500/20 blur-[140px] rounded-full" />

            {/* STAGE */}
            <div className="relative w-full max-w-[780px] h-[260px] md:h-[460px] flex items-center justify-center">

              {/* CAR */}
              <Image
                src="/car.png"
                alt="Car"
                width={750}
                height={450}
                className="relative z-10 w-[280px] md:w-[750px] object-contain opacity-90"
              />

              {/* LABEL 1 */}
              <div className="absolute left-2 md:left-[10px] top-6 md:top-[70px] flex items-center gap-2">
                <div className="w-4 md:w-6 h-[1px] bg-green-400/60" />
                <div className="bg-black/60 border border-white/10 px-2 md:px-3 py-1 rounded-md text-[10px] md:text-[11px] text-white/80">
                  Mileage Verified
                </div>
              </div>

              {/* LABEL 2 */}
              <div className="absolute right-2 md:right-[10px] top-6 md:top-[90px] flex items-center gap-2">
                <div className="bg-black/60 border border-white/10 px-2 md:px-3 py-1 rounded-md text-[10px] md:text-[11px] text-white/80">
                  No Accident
                </div>
                <div className="w-4 md:w-6 h-[1px] bg-green-400/60" />
              </div>

              {/* LABEL 3 */}
              <div className="absolute left-2 md:left-[10px] bottom-6 md:bottom-[90px] flex items-center gap-2">
                <div className="w-4 md:w-6 h-[1px] bg-green-400/60" />
                <div className="bg-black/60 border border-white/10 px-2 md:px-3 py-1 rounded-md text-[10px] md:text-[11px] text-white/80">
                  Ownership History
                </div>
              </div>

              {/* LABEL 4 */}
              <div className="absolute right-2 md:right-[10px] bottom-6 md:bottom-[80px] flex items-center gap-2">
                <div className="bg-black/60 border border-white/10 px-2 md:px-3 py-1 rounded-md text-[10px] md:text-[11px] text-green-400">
                  Market Value $18.2K
                </div>
                <div className="w-4 md:w-6 h-[1px] bg-green-400/60" />
              </div>

            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6 text-center md:text-left">

            <h2 className="text-2xl font-bold">
              Get full report instantly
            </h2>

            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-xl">

              {/* TABS */}
              <div className="flex justify-center md:justify-start gap-2 mb-3">

                <button
                  onClick={() => setVehicleIdType('vin')}
                  className={`px-3 py-1 text-xs rounded-full transition ${
                    vehicleIdType === 'vin'
                      ? 'bg-green-500 text-black'
                      : 'bg-white/10 text-white/70'
                  }`}
                >
                  VIN
                </button>

                <button
                  onClick={() => setVehicleIdType('plate')}
                  className={`px-3 py-1 text-xs rounded-full transition ${
                    vehicleIdType === 'plate'
                      ? 'bg-green-500 text-black'
                      : 'bg-white/10 text-white/70'
                  }`}
                >
                  Plate
                </button>

              </div>

              {/* INPUT */}
              <Input
                placeholder={vehicleIdType === 'vin' ? "Enter VIN" : "Enter Plate"}
                value={vehicleIdType === 'vin' ? vin : plateNumber}
                onChange={(e) =>
                  vehicleIdType === 'vin'
                    ? setVin(e.target.value.toUpperCase())
                    : setPlateNumber(e.target.value.toUpperCase())
                }
                className="h-11 bg-white/5 border border-white/20 text-white"
              />

              {/* BUTTON */}
              <Button
                onClick={handleSubmit}
                className="w-full mt-3 h-11 bg-green-500 hover:bg-green-400 text-black font-bold"
              >
                Get Report
              </Button>

            </div>

          </div>

        </div>
      </div>

      <GetReportForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        prefilledIdentType={vehicleIdType || undefined}
        prefilledIdentValue={vehicleIdType === 'vin' ? vin : plateNumber}
      />

    </section>
  )
}