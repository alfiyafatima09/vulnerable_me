'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: number
  name: string
  price: number
  category: string
  image: string
  description: string
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState('')

  const handleSearch = useCallback(async () => {
    try {
      // Intentionally vulnerable: No input sanitization
      const response = await fetch(
        `/api/search?term=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(category)}`
      )
      const data = await response.json()

      if (response.ok) {
        setProducts(data.products)
      } else {
        setError(data.message || 'Search failed')
      }
    } catch {
      setError('An error occurred during search')
    }
  }, [searchTerm, category])

  useEffect(() => {
    handleSearch()
  }, [handleSearch])

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Search Products</h1>
          <Link
            href="/"
            className="text-blue-500 hover:text-blue-600"
          >
            Back to Home
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div>
            <label htmlFor="search" className="block text-sm font-medium mb-1">
              Search Term
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter search term"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Computers">Computers</option>
              <option value="Accessories">Accessories</option>
              <option value="Gaming">Gaming</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm mb-4">{error}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg overflow-hidden">
              <div className="relative h-48">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2">{product.description}</p>
                <p className="text-blue-500 font-semibold">${product.price}</p>
                <p className="text-sm text-gray-500 mt-2">{product.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
} 