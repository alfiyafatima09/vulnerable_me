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

    // Create products table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        image TEXT NOT NULL,
        description TEXT
      )
    `)

    // Insert sample products
    await db.exec(`
      INSERT INTO products (name, price, category, image, description) VALUES 
      ('Premium Wireless Headphones', 199.99, 'Electronics', 'https://images.unsplash.com/photo-PDX_a_82obo', 'High-quality wireless headphones with noise cancellation'),
      ('Smart Watch Series 5', 299.99, 'Electronics', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop', 'Advanced smartwatch with health monitoring features'),
      ('Professional Camera Kit', 899.99, 'Electronics', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop', 'Professional DSLR camera with multiple lenses'),
      ('Gaming Laptop Pro', 1299.99, 'Computers', 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&h=500&fit=crop', 'High-performance gaming laptop with RTX graphics'),
      ('Mechanical Keyboard', 149.99, 'Accessories', 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=500&h=500&fit=crop', 'RGB mechanical keyboard with customizable keys'),
      ('Gaming Mouse', 79.99, 'Accessories', 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop', 'Precision gaming mouse with adjustable DPI'),
      ('Gaming Headset', 129.99, 'Gaming', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop', '7.1 surround sound gaming headset'),
      ('Gaming Chair', 299.99, 'Gaming', 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=500&h=500&fit=crop', 'Ergonomic gaming chair with lumbar support')
    `)
  }
  return db
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const term = searchParams.get('term') || ''
    const category = searchParams.get('category') || ''
    
    // Intentionally vulnerable: Direct string concatenation in SQL query
    const db = await getDb()
    let query = `
      SELECT * FROM products 
      WHERE name LIKE '%${term}%' 
      OR description LIKE '%${term}%'
    `
    
    if (category) {
      query += ` AND category = '${category}'`
    }
    
    const products = await db.all(query)

    return NextResponse.json({ products })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
} 