"use client"

import { useState, useEffect, useRef } from 'react'
import { Quote, CheckCircle, User, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ReviewForm from './ReviewForm'
import { Review } from '@/lib/database'
import { useTranslations } from '@/lib/translations'

export default function Testimonials() {
  const { t } = useTranslations()
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/reviews')
        const data = await res.json().catch(() => null)

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.rows)
          ? data.rows
          : Array.isArray(data?.reviews)
          ? data.reviews
          : []

        setReviews(list)
      } catch (e) {
        setReviews([])
      }
      setIsLoading(false)
    }
    fetchReviews()
  }, [])

  const renderStars = (rating: number) => (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(i => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= rating ? "text-green-400 fill-green-400" : "text-white/20"
          }`}
        />
      ))}
    </div>
  )

  return (
    <section className="relative py-24 bg-black text-white overflow-hidden">

      {/* background glow */}
      <div className="absolute inset-0">
        <div className="absolute top-[-120px] left-[-120px] w-[400px] h-[400px] bg-green-500/10 blur-[150px]" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-blue-500/10 blur-[150px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4">

        {/* TOP SECTION (NEW LAYOUT) */}
        <div className="grid md:grid-cols-2 gap-10 items-center mb-16">

          {/* LEFT CONTENT */}
          <div>

            <h2 className="text-3xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-green-400 to-blue-400 text-transparent bg-clip-text">
              Real Drivers. Real Stories.
            </h2>

            <p className="text-white/60 mt-4 text-sm md:text-base">
              Thousands of users trust us daily to verify vehicle history before buying or selling.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-8">

              <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <p className="text-green-400 text-2xl font-bold">2.5M+</p>
                <p className="text-white/60 text-xs">Reports Generated</p>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                <p className="text-green-400 text-2xl font-bold">98%</p>
                <p className="text-white/60 text-xs">Accuracy Rate</p>
              </div>

            </div>

            <Button
              onClick={() => setIsOpen(true)}
              className="mt-6 bg-green-500 text-black hover:bg-green-400 rounded-full px-6"
            >
              Add Your Review
            </Button>

          </div>

          {/* RIGHT VIDEO */}
          <div className="relative h-[260px] md:h-[380px] rounded-2xl overflow-hidden border border-white/10">

            <video
              src="/accidental.mp4"
              autoPlay
              muted
              loop
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-6">

              <div>
                <p className="text-green-400 font-semibold">Trusted Platform</p>
                <p className="text-white/70 text-sm">
                  Every report is verified from multiple sources.
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* REVIEWS SCROLL (NEW LAYOUT) */}
        <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory">

          {isLoading ? (
            <div className="text-white/50">Loading...</div>
          ) : (
            reviews.map((r) => (
              <div
                key={r.id}
                className="min-w-[280px] md:min-w-[320px] bg-white/5 border border-white/10 p-5 rounded-2xl snap-start"
              >

                <Quote className="text-green-400 mb-3" />

                {renderStars(r.rating)}

                <p className="text-white/70 text-sm mt-3">
                  {r.comment}
                </p>

                <div className="flex items-center gap-3 mt-5">

                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                    <User className="w-5 h-5 text-black" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">{r.name}</p>
                    <p className="text-xs text-green-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Verified User
                    </p>
                  </div>

                </div>

              </div>
            ))
          )}

        </div>

      </div>

      <ReviewForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />

    </section>
  )
}