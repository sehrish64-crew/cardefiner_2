import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 [DEBUG] Test email endpoint called')
    console.log('🧪 [DEBUG] Environment check:')
    console.log('  - SMTP_HOST:', process.env.SMTP_HOST)
    console.log('  - SMTP_USER:', process.env.SMTP_USER)
    console.log('  - ADMIN_EMAIL:', process.env.ADMIN_EMAIL)
    
    const body = await request.json()
    console.log('🧪 [DEBUG] Request body:', body)
    
    // Direct fetch to send-email
    const baseUrl = 'http://localhost:3003'
    const emailResponse = await fetch(`${baseUrl}/api/send-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'report_request',
        to: process.env.ADMIN_EMAIL || 'cardefiner@gmail.com',
        subject: 'Test Email',
        htmlContent: '<h1>Test Email Body</h1><p>This is a test email</p>'
      })
    })
    
    const emailData = await emailResponse.json()
    console.log('🧪 [DEBUG] Email response:', emailData)
    
    return NextResponse.json({
      success: true,
      message: 'Test email sent',
      debug: {
        emailResponse: emailData
      }
    })
    
  } catch (error) {
    console.error('🧪 [DEBUG] Error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
