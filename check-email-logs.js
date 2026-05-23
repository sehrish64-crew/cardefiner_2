// Check Email Logs in Database
require('dotenv').config({ path: '.env.local' })
const mysql = require('mysql2/promise')

async function checkEmailLogs() {
  let connection
  try {
    console.log('🔍 Checking Database Email Logs...\n')
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    })
    
    console.log('✅ Database Connected\n')
    
    // Check email_outbox
    console.log('📧 Recent Emails in Outbox:')
    const [outbox] = await connection.execute(
      'SELECT id, to_address, subject, status, created_at FROM email_outbox ORDER BY created_at DESC LIMIT 10'
    )
    if (outbox.length > 0) {
      outbox.forEach((email, i) => {
        console.log(`${i+1}. To: ${email.to_address} | Status: ${email.status} | Subject: ${email.subject.substring(0, 40)}...`)
      })
    } else {
      console.log('❌ No emails in outbox')
    }
    
    console.log('\n📧 Failed Emails:')
    const [failures] = await connection.execute(
      'SELECT id, to_address, subject, error_message, created_at FROM email_failures ORDER BY created_at DESC LIMIT 10'
    )
    if (failures.length > 0) {
      failures.forEach((email, i) => {
        console.log(`${i+1}. To: ${email.to_address} | Error: ${email.error_message.substring(0, 50)}...`)
      })
    } else {
      console.log('✅ No failed emails')
    }
    
    console.log('\n')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    if (connection) await connection.end()
  }
}

checkEmailLogs()
