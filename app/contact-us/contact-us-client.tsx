'use client'

import { useState, useEffect, useRef } from 'react'
import { Mail, MapPin, Send, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useTranslations } from '@/lib/translations'
import { parseJsonSafe } from '@/lib/utils'

const PRIMARY = "#22c55e" // neon green

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    details: ['info@cardefiner.com'],
    gradient: 'from-green-400 to-cyan-400'
  },
  {
    icon: MapPin,
    title: 'Office',
    details: ['8 The Green, Suite A in the city of Dover Zip code 19901'],
    gradient: 'from-green-400 to-cyan-400'
  }
]

export default function ContactUsClient() {
  const { t } = useTranslations()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const [isVisible, setIsVisible] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')
    setSubmitSuccess(false)

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await parseJsonSafe(res)

      if (!res.ok) throw new Error(data.error || 'Failed')

      setSubmitSuccess(true)
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative overflow-hidden bg-black text-white">

      {/* Glow Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-black"></div>
      <div className="absolute -top-20 left-10 w-96 h-96 bg-green-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>

      <div ref={heroRef} className="relative container mx-auto px-4 py-16">

        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/5 border border-white/10 rounded-full text-green-400 font-semibold">
            <MessageCircle size={16} />
            Get in Touch
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold mt-6">
            Contact <span className="text-green-400">cardefiner</span>
          </h1>

          <p className="text-gray-400 mt-4 text-lg">
            We’re here to help you with vehicle history reports & support anytime.
          </p>
        </div>

        {/* CONTACT CARDS */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {contactInfo.map((item, i) => (
            <div
              key={i}
              className="group bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-md hover:shadow-[0_0_30px_rgba(0,255,150,0.2)] transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.gradient} flex items-center justify-center text-black`}>
                <item.icon />
              </div>

              <h3 className="text-xl font-bold mt-4 text-white">{item.title}</h3>

              {item.details.map((d, idx) => (
                <p key={idx} className="text-gray-400 text-sm mt-1">
                  {d}
                </p>
              ))}
            </div>
          ))}
        </div>

        {/* FORM */}
        <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">

          <div className="bg-gradient-to-r from-green-400 to-cyan-400 text-black p-6 md:p-10">
            <h2 className="text-2xl md:text-3xl font-bold">
              Send us a message
            </h2>
            <p className="text-black/70 mt-2 text-sm">
              We usually respond within 2–4 hours
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-5">

            <div className="grid md:grid-cols-2 gap-5">
              <Input
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/10 border-white/10 text-white placeholder:text-gray-400 focus:ring-green-400"
              />

              <Input
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-white/10 border-white/10 text-white placeholder:text-gray-400 focus:ring-green-400"
              />
            </div>

            <Input
              placeholder="Subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="bg-white/10 border-white/10 text-white placeholder:text-gray-400 focus:ring-green-400"
            />

            <Textarea
              placeholder="Your Message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="min-h-[140px] bg-white/10 border-white/10 text-white placeholder:text-gray-400 focus:ring-green-400"
            />

            {submitSuccess && (
              <p className="text-green-400 font-medium">Message sent successfully!</p>
            )}

            {submitError && (
              <p className="text-red-400">{submitError}</p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-green-400 to-cyan-400 text-black py-3 rounded-xl text-lg font-semibold transition-all shadow-[0_0_20px_rgba(0,255,150,0.4)] hover:scale-105"
            >
              <Send className="mr-2" size={18} />
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </div>

      </div>
    </div>
  )
}