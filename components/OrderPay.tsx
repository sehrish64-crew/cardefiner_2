"use client"

import React from 'react'

export default function OrderPay({ currency, amount }: { currency?: string; amount?: number | string }) {
  const displayAmount = amount ? Number(amount).toFixed(2) : ''

  return (
    <div className="mt-6 text-center">
      <div className="mb-3 text-sm text-gray-700">Payment Processing</div>
      <div className="inline-block p-4 bg-blue-50 border border-blue-200 rounded">
        <p className="text-sm text-gray-600">
          Our payment system is being updated. Please try again later.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Order Total: {currency} {displayAmount}
        </p>
      </div>
    </div>
  )
}
