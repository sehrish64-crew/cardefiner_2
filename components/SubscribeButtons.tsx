"use client"

import React, { useState } from 'react'

const packages = [
  { key: 'basic', name: 'Basic Plan' },
  { key: 'standard', name: 'Standard Plan' },
  { key: 'premium', name: 'Premium Plan' },
]

export default function SubscribeButtons() {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCheckout = async (pkgKey: string) => {
    setIsProcessing(true)
    try {
      // TODO: Integrate with new payment provider
      alert('Payment system is being updated. Please try again later.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex gap-3">
      {packages.map((pkg) => (
        <button
          key={pkg.key}
          onClick={() => handleCheckout(pkg.key)}
          className={`px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isProcessing}
        >
          Subscribe to {pkg.name}
        </button>
      ))}
    </div>
  )
}
