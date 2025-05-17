import { NextResponse } from 'next/server'
import sqlite3 from 'sqlite3'
import { Database, open } from 'sqlite'

// Initialize database
let db: Database | null = null

async function getDb() {
  if (!db) {
    db = await open({
      filename: ':memory:',
      driver: sqlite3.Database
    })

    // Create users table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        password TEXT NOT NULL
      )
    `)

    // Insert test user
    await db.exec(`
      INSERT INTO users (email, password) 
      VALUES ('admin@example.com', 'admin123')
    `)
  }
  return db
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    // Intentionally vulnerable: Direct string concatenation in SQL query
    const db = await getDb()
    const query = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`
    
    const user = await db.get(query)

    if (user) {
      return NextResponse.json({ 
        success: true, 
        message: 'Login successful',
        user: { email: user.email }
      })
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
} 