import { NextRequest, NextResponse } from 'next/server'

function generateReportRequestEmail(data: any): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #22c55e;">New Vehicle Report Request 📋</h2>
      <p>Hello Admin,</p>
      <p>A new vehicle report request has been submitted. Details are below:</p>
      
      <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #333; border-bottom: 2px solid #ddd; padding-bottom: 10px;">Customer Information:</h3>
        <p style="margin: 8px 0;"><strong>Email:</strong> ${data.customerEmail}</p>
        <p style="margin: 8px 0;"><strong>Vehicle Type:</strong> ${data.vehicleType}</p>
        <p style="margin: 8px 0;"><strong>${data.identificationType === 'vin' ? 'VIN' : 'Plate'} Number:</strong> ${data.identificationValue}</p>
        <p style="margin: 8px 0;"><strong>Selected Package:</strong> ${data.selectedPackage}</p>
        <p style="margin: 8px 0;"><strong>Price:</strong> ${data.currency} ${data.price}</p>
        <p style="margin: 8px 0;"><strong>Country:</strong> ${data.country}</p>
        ${data.orderId ? `<p style="margin: 8px 0;"><strong>Order ID:</strong> ${data.orderId}</p>` : ''}
      </div>
      
      <p style="color: #666; font-size: 14px; margin-top: 20px;"><em>This customer will be redirected to payment after submitting their form.</em></p>
    </div>
  `
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customerEmail,
      vehicleType,
      identificationType,
      identificationValue,
      selectedPackage,
      country,
      currency,
      price,
      orderId,
    } = body

    // Validate required fields
    if (!customerEmail || !vehicleType || !identificationValue || !selectedPackage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Send email via unified send-email endpoint
    const emailHtml = generateReportRequestEmail({
      customerEmail,
      vehicleType,
      identificationType,
      identificationValue,
      selectedPackage,
      country,
      currency,
      price,
      orderId,
    })

    try {
      // In development, always use the request's host to ensure correct port
      let baseUrl
      
      if (process.env.NODE_ENV === 'development' && request.headers.get('host')) {
        baseUrl = `http://${request.headers.get('host')}`
      } else {
        // In production, use the environment variable
        baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      }
      
      const emailUrl = new URL('/api/send-email', baseUrl).toString()
      
      console.log('[send-report-request] Calling email endpoint at:', emailUrl)
      
      const emailResponse = await fetch(emailUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'report_request',
          to: process.env.ADMIN_EMAIL || 'cardefiner@gmail.com',
          subject: `New Vehicle Report Request - ${vehicleType}`,
          htmlContent: emailHtml,
        }),
      })

      if (!emailResponse.ok) {
        console.warn('[send-report-request] Failed to send email:', await emailResponse.text())
      } else {
        console.log('[send-report-request] Email sent successfully')
      }
    } catch (emailError) {
      console.warn('[send-report-request] Email error:', emailError)
      // Don't fail the flow if email fails
    }

    return NextResponse.json(
      { success: true, message: 'Request received' },
      { status: 200 }
    )
  } catch (error) {
    console.error('[send-report-request] Error:', error)
    // Don't fail the payment flow if something goes wrong
    return NextResponse.json(
      { success: true, message: 'Request received' },
      { status: 200 }
    )
  }
}
