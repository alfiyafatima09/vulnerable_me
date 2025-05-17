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

    // Create profiles table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        bio TEXT
      )
    `)

    // Insert sample profile
    await db.exec(`
      INSERT INTO profiles (name, email, bio) 
      VALUES ('John Doe', 'john@example.com', 'Software developer')
    `)
  }
  return db
}

export async function GET() {
  try {
    const db = await getDb()
    const profile = await db.get('SELECT * FROM profiles WHERE id = 1')

    if (profile) {
      return NextResponse.json(profile)
    } else {
      return NextResponse.json(
        { message: 'Profile not found' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const profile = await request.json()
    const db = await getDb()

    // Intentionally vulnerable: No input sanitization
    await db.run(
      `UPDATE profiles SET name = '${profile.name}', email = '${profile.email}', bio = '${profile.bio}' WHERE id = 1`
    )

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 