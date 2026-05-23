import { NextResponse } from 'next/server'
import pool from '@/lib/mysql'

export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: {
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'database',
      pool: null as any,
      connection: null as any,
      tables: [] as string[],
      reviewsTableExists: false,
      reviewsTableSchema: null as any,
    },
    errors: [] as string[],
  }

  try {
    // Test connection
    console.log('🔍 [DIAGNOSTIC] Testing database connection...')
    const conn = await pool.getConnection()
    diagnostics.database.connection = '✅ Connected'

    try {
      // Get list of tables
      console.log('🔍 [DIAGNOSTIC] Fetching tables...')
      const [tables]: any = await conn.execute(
        `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE()`
      )
      diagnostics.database.tables = tables.map((t: any) => t.TABLE_NAME)
      console.log('✅ Tables found:', diagnostics.database.tables)

      // Check if reviews table exists
      const reviewsTableExists = diagnostics.database.tables.includes('reviews')
      diagnostics.database.reviewsTableExists = reviewsTableExists
      console.log('🔍 Reviews table exists:', reviewsTableExists)

      // Get reviews table schema
      if (reviewsTableExists) {
        console.log('🔍 [DIAGNOSTIC] Fetching reviews table schema...')
        const [schema]: any = await conn.execute(
          `DESCRIBE reviews`
        )
        diagnostics.database.reviewsTableSchema = schema.map((col: any) => ({
          Field: col.Field,
          Type: col.Type,
          Null: col.Null,
          Key: col.Key,
          Default: col.Default,
          Extra: col.Extra,
        }))
        console.log('✅ Reviews table schema:', diagnostics.database.reviewsTableSchema)
      }

      // Try to insert a test record
      console.log('🔍 [DIAGNOSTIC] Attempting test insert...')
      try {
        const [result]: any = await conn.execute(
          'INSERT INTO reviews (name, email, rating, comment) VALUES (?, ?, ?, ?)',
          ['Test User', 'test@example.com', 5, 'This is a test']
        )
        console.log('✅ Test insert successful, insertId:', result.insertId)

        // Clean up test record
        try {
          await conn.execute('DELETE FROM reviews WHERE name = ?', ['Test User'])
          console.log('✅ Test record cleaned up')
        } catch (e) {
          console.warn('⚠️ Could not clean up test record:', e)
        }

        diagnostics.database.pool = '✅ Insert/Query working'
      } catch (insertErr) {
        const errMsg = insertErr instanceof Error ? insertErr.message : String(insertErr)
        console.error('❌ Test insert failed:', errMsg)
        diagnostics.errors.push(`Insert test failed: ${errMsg}`)
        diagnostics.database.pool = `❌ Insert failed: ${errMsg}`
      }
    } finally {
      conn.release()
      console.log('🔄 Connection released')
    }
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error)
    console.error('❌ [DIAGNOSTIC] Connection error:', errMsg)
    diagnostics.errors.push(`Connection error: ${errMsg}`)
    diagnostics.database.connection = `❌ ${errMsg}`

    if (error instanceof Error) {
      diagnostics.errors.push(error.stack || '')
    }
  }

  return NextResponse.json(diagnostics)
}
