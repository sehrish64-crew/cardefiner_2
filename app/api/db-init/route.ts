import { NextResponse } from 'next/server'
import pool from '@/lib/mysql'

export async function POST() {
  try {
    console.log('📦 Initializing database schema...')
    
    const conn = await pool.getConnection()
    
    try {
      // Create reviews table if it doesn't exist
      const createReviewsTable = `
        CREATE TABLE IF NOT EXISTS reviews (
          id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          rating TINYINT NOT NULL,
          comment TEXT NOT NULL,
          status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          approved_at DATETIME DEFAULT NULL,
          INDEX idx_status (status),
          INDEX idx_created_at (created_at)
        )
      `
      
      await conn.execute(createReviewsTable)
      console.log('✅ Reviews table created/verified')
      
      // Create contact_submissions table if it doesn't exist
      const createContactTable = `
        CREATE TABLE IF NOT EXISTS contact_submissions (
          id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          subject VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          status ENUM('new','read','responded') NOT NULL DEFAULT 'new',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `
      
      await conn.execute(createContactTable)
      console.log('✅ Contact submissions table created/verified')
      
      return NextResponse.json({
        success: true,
        message: 'Database schema initialized successfully'
      })
    } finally {
      conn.release()
    }
  } catch (error) {
    console.error('❌ Database initialization error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to initialize database',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    console.log('📊 Checking database tables...')
    
    const conn = await pool.getConnection()
    
    try {
      const [tables]: any = await conn.execute(
        `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE()`
      )
      
      console.log('✅ Database tables:', tables.map((t: any) => t.TABLE_NAME))
      
      return NextResponse.json({
        success: true,
        tables: tables.map((t: any) => t.TABLE_NAME)
      })
    } finally {
      conn.release()
    }
  } catch (error) {
    console.error('❌ Database check error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check database',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    )
  }
}
