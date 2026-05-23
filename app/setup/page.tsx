'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function DatabaseSetupPage() {
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const checkDatabase = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/diagnostic')
      const data = await response.json()
      setStatus(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check database')
    } finally {
      setLoading(false)
    }
  }

  const initializeDatabase = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/db-init', {
        method: 'POST',
      })
      const data = await response.json()
      if (data.success) {
        setError('✅ Database initialized successfully! Please refresh the page.')
        await new Promise(resolve => setTimeout(resolve, 1000))
        checkDatabase()
      } else {
        setError('❌ ' + (data.error || 'Failed to initialize database'))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize database')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Database Setup & Diagnostic</h1>

          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="flex gap-4 flex-wrap">
              <Button
                onClick={checkDatabase}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? 'Checking...' : 'Check Database Status'}
              </Button>
              <Button
                onClick={initializeDatabase}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {loading ? 'Initializing...' : 'Initialize Database'}
              </Button>
            </div>

            {/* Error/Success Message */}
            {error && (
              <div className={`p-4 rounded-lg ${error.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {error}
              </div>
            )}

            {/* Status Display */}
            {status && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">Database Status</h2>

                {/* Connection Status */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Connection</h3>
                  <p className={`text-sm ${status.database.connection.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                    {status.database.connection}
                  </p>
                </div>

                {/* Pool Status */}
                {status.database.pool && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">Pool Status</h3>
                    <p className={`text-sm ${status.database.pool.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
                      {status.database.pool}
                    </p>
                  </div>
                )}

                {/* Tables */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Tables ({status.database.tables.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {status.database.tables.map((table: string) => (
                      <span
                        key={table}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          table === 'reviews'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        {table}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Reviews Table Schema */}
                {status.database.reviewsTableSchema && (
                  <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
                    <h3 className="font-semibold text-gray-900 mb-2">Reviews Table Schema</h3>
                    <table className="text-xs w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Field</th>
                          <th className="text-left p-2">Type</th>
                          <th className="text-left p-2">Null</th>
                          <th className="text-left p-2">Key</th>
                        </tr>
                      </thead>
                      <tbody>
                        {status.database.reviewsTableSchema.map((col: any, i: number) => (
                          <tr key={i} className="border-b">
                            <td className="p-2">{col.Field}</td>
                            <td className="p-2">{col.Type}</td>
                            <td className="p-2">{col.Null}</td>
                            <td className="p-2">{col.Key || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Errors */}
                {status.errors.length > 0 && (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-red-900 mb-2">Errors</h3>
                    <ul className="text-sm text-red-700 space-y-1">
                      {status.errors.map((err: string, i: number) => (
                        <li key={i}>• {err}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
