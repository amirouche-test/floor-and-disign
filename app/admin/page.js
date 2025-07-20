'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useAdminAuthRedirect from '@/hooks/useAdminAuthRedirect'
import { Mail, Lock } from 'lucide-react'  // ← ajout d'icônes Lucide pour illustrer avec force

export default function AdminLoginPage() {
  useAdminAuthRedirect(true)

  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setProgress(20)

    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      setProgress(70)

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem('admin-auth', email)
        setProgress(100)
        router.push('/admin/dashboard')
      } else {
        setError(data.message || 'Erreur de connexion')
        setProgress(0)
      }
    } catch (err) {
      console.error(err)
      setError('Erreur serveur')
      setProgress(0)
    } finally {
      setLoading(false)
      setTimeout(() => setProgress(0), 800)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900">
      <div className="bg-gray-900 border border-gray-700 shadow-2xl rounded-2xl p-8 w-full max-w-md space-y-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-center text-blue-400">
          Connexion Admin
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="flex items-center gap-1 text-xs font-semibold text-gray-400 mb-1">
              <Mail size={16} className="text-blue-400" /> {/* icône plus forte et colorée */}
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@site.com"
              required
              className="w-full px-3 py-2 border border-gray-600 rounded-xl shadow-sm 
                         bg-gray-800 text-gray-100 placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="flex items-center gap-1 text-xs font-semibold text-gray-400 mb-1">
              <Lock size={16} className="text-blue-400" /> {/* icône plus forte et colorée */}
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3 py-2 border border-gray-600 rounded-xl shadow-sm 
                         bg-gray-800 text-gray-100 placeholder-gray-500
                         focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-xl shadow 
                       hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>

      {/* Progress bar fine et forte */}
      {loading && (
        <div className="fixed bottom-0 left-0 w-full h-1 bg-gray-700">
          <div
            className="bg-blue-600 h-1 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}
