'use client'

import { useState, useEffect } from 'react'
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
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const categoryParam = params.get('category')
    if (categoryParam) {
      setCategory(categoryParam)
      handleSearch('', categoryParam)
    }
  }, [])

  const handleSearch = async (term: string = searchTerm, cat: string = category) => {
    setLoading(true)
    setError('')

    try {
      // Intentionally vulnerable: No input sanitization
      const response = await fetch(
        `/api/search?term=${encodeURIComponent(term)}&category=${encodeURIComponent(cat)}`
      )
      const data = await response.json()

      if (response.ok) {
        setProducts(data.products)
      } else {
        setError(data.message || 'Search failed')
      }
    } catch (err) {
      setError('An error occurred during search')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">TechStore</h1>
            <nav className="flex items-center space-x-4">
              <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
              <a href="/login" className="text-gray-600 hover:text-gray-900">Login</a>
              <a href="/profile" className="text-gray-600 hover:text-gray-900">My Account</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">Filters</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value)
                      handleSearch(searchTerm, e.target.value)
                    }}
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
            </div>
          </div>

          {/* Search Results */}
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="mb-6">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 p-2 border rounded"
                  placeholder="Search products..."
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  Search
                </button>
              </div>
            </form>

            {error && (
              <div className="text-red-500 mb-4">{error}</div>
            )}

            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="relative h-48">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                      <p className="text-xl font-bold text-blue-600 mb-2">
                        ${product.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                      <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No products found
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
} 