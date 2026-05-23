// Test Script - Email SMTP Connection
require('dotenv').config({ path: '.env.local' })
const nodemailer = require('nodemailer')

async function testEmail() {
  try {
    console.log('🔍 Testing SMTP Configuration...\n')
    
    const SMTP_HOST = process.env.SMTP_HOST
    const SMTP_PORT = Number(process.env.SMTP_PORT)
    const SMTP_USER = process.env.SMTP_USER
    const SMTP_PASS = process.env.SMTP_PASS
    const SMTP_SECURE = process.env.SMTP_SECURE === 'true'
    
    console.log('📋 Configuration:')
    console.log(`   Host: ${SMTP_HOST}`)
    console.log(`   Port: ${SMTP_PORT}`)
    console.log(`   User: ${SMTP_USER}`)
    console.log(`   Secure: ${SMTP_SECURE}`)
    console.log(`   Admin Email: ${process.env.ADMIN_EMAIL}\n`)
    
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    })
    
    console.log('🔗 Testing connection...')
    await transporter.verify()
    console.log('✅ SMTP Connection Successful!\n')
    
    // Send test email
    console.log('📧 Sending test email...')
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      subject: '🧪 Test Email from CarDefiner',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #22c55e;">✅ Email System Working!</h2>
          <p>Yeh ek test email hai.</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <p>Agar yeh email mil gaya to form emails bhi chalenge!</p>
        </div>
      `
    })
    
    console.log('✅ Email Sent Successfully!')
    console.log(`📧 Message ID: ${info.messageId}`)
    console.log(`\n✔️ SMTP configuration theek hai!\n`)
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error('\nDebug Info:')
    console.error(error)
  }
}

testEmail()
