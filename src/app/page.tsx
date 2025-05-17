import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Vulnerable Web Application</h1>
        
        <div className="grid gap-6">
          <Link 
            href="/login" 
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-2">Login Page</h2>
            <p className="text-gray-600">Test SQL injection and XSS vulnerabilities</p>
          </Link>

          <Link 
            href="/search" 
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-2">Search Page</h2>
            <p className="text-gray-600">Test SQL injection and command injection</p>
          </Link>

          <Link 
            href="/profile" 
            className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-2">Profile Page</h2>
            <p className="text-gray-600">Test XSS and CSRF vulnerabilities</p>
          </Link>
        </div>
      </div>
    </main>
  )
}
