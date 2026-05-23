// Check database for recent emails
require('dotenv').config()
const mysql = require('mysql2/promise')

async function checkEmails() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
  })

  try {
    const connection = await pool.getConnection()

    const [emails] = await connection.execute(
      `SELECT id, to_address, subject, status, created_at FROM email_outbox 
       ORDER BY id DESC LIMIT 5`
    )

    console.log('\n📧 Latest Emails Sent:\n')
    emails.forEach((email, idx) => {
      console.log(`${idx + 1}. To: ${email.to_address}`)
      console.log(`   Subject: ${email.subject}`)
      console.log(`   Status: ✅ ${email.status}`)
      console.log(`   Time: ${email.created_at}\n`)
    })

    connection.release()
  } catch (error) {
    console.error('Error:', error.message)
  }

  await pool.end()
}

checkEmails()
