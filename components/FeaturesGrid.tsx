"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, TrendingUp, FileText, AlertTriangle, Zap, Shield } from 'lucide-react'

export default function FeaturesGrid() {
  const [activeTab, setActiveTab] = useState('odometer')
  const [isAutoPlay] = useState(true)

  const tabs = [
    { id: 'odometer', label: 'Odometer Check' },
    { id: 'ownership', label: 'Ownership History' },
    { id: 'photos', label: 'Photos on Sale' },
    { id: 'damage', label: 'Damage Check' },
    { id: 'technical', label: 'Technical Data' },
    { id: 'stolen', label: 'Stolen VIN Check' },
  ]

  useEffect(() => {
    if (!isAutoPlay) return

    const interval = setInterval(() => {
      setActiveTab((prev) => {
        const i = tabs.findIndex(t => t.id === prev)
        return tabs[(i + 1) % tabs.length].id
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlay])

  return (
    <section className="relative py-16 md:py-24 bg-black text-white overflow-hidden">

      {/* background glow (banner style) */}
      <div className="absolute inset-0">
        <div className="absolute top-[-150px] left-[-150px] w-[500px] h-[500px] bg-green-500/10 blur-[150px]" />
        <div className="absolute bottom-[-150px] right-[-150px] w-[500px] h-[500px] bg-blue-500/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.05)_1px,_transparent_1px)] [background-size:25px_25px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4">

        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-green-400 to-blue-400 text-transparent bg-clip-text">
            Full Vehicle History in One Place
          </h2>
          <p className="text-gray-400 mt-3 text-sm md:text-base">
            Instant access to mileage, damage, ownership and hidden records.
          </p>
        </div>

        {/* TABS */}
        <div className="flex overflow-x-auto gap-20 border-b border-black/10 pb-3 mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-4 py-2 text-xs md:text-sm rounded-full transition ${
                activeTab === tab.id
                  ? "bg-green-500 text-black font-semibold"
                  : "bg-white/5 text-gray-300 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTENT WRAPPER */}
        <div>

          {/* ODOMETER */}
          {activeTab === 'odometer' && (
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <Image src="/odometer-check-en@1x.webp" alt="" width={600} height={400} />

              <div>
                <div className="text-green-400 mb-2"><TrendingUp /></div>
                <h3 className="text-xl md:text-2xl font-bold">Mileage Verification</h3>
                <p className="text-gray-400 mt-2 text-sm">
                  Detect odometer rollback and fraud history.
                </p>

                <Link href="/pricing" className="mt-5 inline-flex items-center gap-2 bg-green-500 text-black px-5 py-2 rounded-full font-semibold">
                  Check Now <ChevronRight />
                </Link>
              </div>
            </div>
          )}

          {/* OWNERSHIP */}
          {activeTab === 'ownership' && (
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <Image src="/ownership.webp" alt="" width={600} height={400} />

              <div>
                <div className="text-green-400 mb-2"><FileText /></div>
                <h3 className="text-xl md:text-2xl font-bold">Ownership History</h3>
                <p className="text-gray-400 mt-2 text-sm">
                  See how many owners and usage history.
                </p>

                <Link href="/pricing" className="mt-5 inline-flex items-center gap-2 bg-green-500 text-black px-5 py-2 rounded-full font-semibold">
                  Check Now <ChevronRight />
                </Link>
              </div>
            </div>
          )}

          {/* PHOTOS */}
          {activeTab === 'photos' && (
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <Image src="/photos-sale.webp" alt="" width={600} height={400} />

              <div>
                <div className="text-purple-400 mb-2"><Zap /></div>
                <h3 className="text-xl md:text-2xl font-bold">Sale Photos History</h3>
                <p className="text-gray-400 mt-2 text-sm">
                  Compare vehicle condition over time.
                </p>

                <Link href="/pricing" className="mt-5 inline-flex items-center gap-2 bg-purple-500 text-black px-5 py-2 rounded-full font-semibold">
                  View Now <ChevronRight />
                </Link>
              </div>
            </div>
          )}

          {/* DAMAGE */}
          {activeTab === 'damage' && (
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <Image src="/damage.webp" alt="" width={600} height={400} />

              <div>
                <div className="text-red-400 mb-2"><AlertTriangle /></div>
                <h3 className="text-xl md:text-2xl font-bold">Damage Reports</h3>
                <p className="text-gray-400 mt-2 text-sm">
                  Accident, flood, fire & insurance records.
                </p>

                <Link href="/pricing" className="mt-5 inline-flex items-center gap-2 bg-red-500 text-black px-5 py-2 rounded-full font-semibold">
                  Check Damage <ChevronRight />
                </Link>
              </div>
            </div>
          )}

          {/* TECHNICAL */}
          {activeTab === 'technical' && (
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <Image src="/specification.webp" alt="" width={600} height={400} />

              <div>
                <div className="text-green-400 mb-2"><Zap /></div>
                <h3 className="text-xl md:text-2xl font-bold">Technical Specs</h3>
                <p className="text-gray-400 mt-2 text-sm">
                  Engine, transmission and full specs.
                </p>
              </div>
            </div>
          )}

          {/* STOLEN */}
          {activeTab === 'stolen' && (
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <Image src="/stolen.webp" alt="" width={600} height={400} />

              <div>
                <div className="text-green-400 mb-2"><Shield /></div>
                <h3 className="text-xl md:text-2xl font-bold">Stolen Check</h3>
                <p className="text-gray-400 mt-2 text-sm">
                  Verify if vehicle is stolen or flagged.
                </p>

                <Link href="/pricing" className="mt-5 inline-flex items-center gap-2 bg-green-500 text-black px-5 py-2 rounded-full font-semibold">
                  Verify Now <ChevronRight />
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  )
}