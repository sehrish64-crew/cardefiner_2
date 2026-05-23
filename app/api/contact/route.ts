import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/mysql'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const conn = await pool.getConnection()
    try {
      await conn.execute(
        'INSERT INTO contact_submissions (name, email, subject, message, status, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
        [name, email, subject, message, 'new']
      )
    } finally {
      conn.release()
    }

    // Send notification to admin
    try {
      const resp = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'contact_form', name, email, subject, message }),
      })

      try {
        const json = await resp.json()
        if (!resp.ok || json?.success === false) {
          console.error('Contact form email failed:', resp.status, json)
        }
      } catch (e) {
        const text = await resp.text().catch(() => null)
        console.error('Failed to parse send-email response for contact_form:', resp.status, text)
      }
    } catch (err) {
      console.error('Failed to send contact notification:', err)
    }

    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
    })
  } catch (error) {
    console.error('Error processing contact form:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
