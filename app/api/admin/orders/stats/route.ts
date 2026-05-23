import { NextRequest, NextResponse } from 'next/server'
import { getOrdersStats } from '@/lib/database'
import { validateToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')
    if (!token || !(await validateToken(token))) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(req.url)
    const days = Number(url.searchParams.get('days') || '30')
    const stats = await getOrdersStats(days)
    return NextResponse.json({ success: true, stats })
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    console.error('Failed to fetch order stats', errorMessage)
    console.error('Full error:', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch stats', details: errorMessage }, { status: 500 })
  }
}
