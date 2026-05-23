import mysql from 'mysql2/promise'

const DB_HOST = process.env.DB_HOST || '127.0.0.1'
const DB_PORT = Number(process.env.DB_PORT || 3306)
const DB_USER = process.env.DB_USER || ''
const DB_PASSWORD = process.env.DB_PASSWORD || ''
const DB_NAME = process.env.DB_NAME || ''

console.log('\n📦 Database Configuration:')
console.log(`  Host: ${DB_HOST}`)
console.log(`  Port: ${DB_PORT}`)
console.log(`  Database: ${DB_NAME}`)

// Create pool only if credentials exist
const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,

  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0,
  enableKeepAlive: true,
})

// SAFE connection test (ONLY in dev or enabled mode)
const shouldTestDB =
  process.env.ENABLE_DB_CHECK === 'true' ||
  process.env.NODE_ENV === 'development'

if (shouldTestDB) {
  pool.getConnection()
    .then((conn) => {
      console.log('✅ Database connection successful\n')
      conn.release()
    })
    .catch((err) => {
      console.error('\n❌ DATABASE CONNECTION FAILED:')
      console.error(`   ${err?.message || err}`)
      console.error(`   Host: ${DB_HOST}`)
      console.error(`   DB: ${DB_NAME}\n`)
    })
} else {
  console.log('\n⚡ DB check skipped (production mode)\n')
}

export default pool