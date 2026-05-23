import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function POST(req: NextRequest) {
  try {
    // Paddle payment system has been removed
    return NextResponse.json(
      { error: 'Payment system is being updated. Please try again later.' },
      { status: 503 }
    )
  } catch (error) {
    console.error('Error initiating payment:', error)
    return NextResponse.json(
      { error: 'Payment system unavailable' },
      { status: 500 }
    )
  }
}
