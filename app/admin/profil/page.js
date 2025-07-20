'use client'

import { useEffect, useState } from 'react'

export default function ProfilPage() {
  const [user, setUser] = useState({ name: '', email: '', newPassword: '' })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      setInitialLoading(true)
      try {
        const res = await fetch('/api/users/me')
        const data = await res.json()
        if (res.ok) {
          setUser({ name: data.name, email: data.email, newPassword: '' })
        }
      } catch (err) {
        console.error(err)
      } finally {
        setInitialLoading(false)
      }
    }
    fetchUser()
  }, [])

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const res = await fetch('/api/users/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      })
      const data = await res.json()
      if (res.ok) {
        setMessage('✅ Profil mis à jour avec succès.')
        setUser({ ...user, newPassword: '' })
      } else {
        setMessage(`❌ ${data.message || 'Erreur lors de la mise à jour.'}`)
      }
    } catch (error) {
      setMessage('❌ Erreur serveur.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-1">Mon Profil</h2>
        <p className="text-sm text-center text-gray-500 mb-6">Modifier vos informations personnelles</p>

        {initialLoading ? (
          <div className="space-y-5 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto" />
            <div className="space-y-3">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Nom</label>
              <input
                name="name"
                type="text"
                value={user.name}
                onChange={handleChange}
                disabled={loading}
                autoComplete="off"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Email</label>
              <input
                name="email"
                type="email"
                value={user.email}
                onChange={handleChange}
                disabled={loading}
                autoComplete="off"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Nouveau mot de passe</label>
              <input
                name="newPassword"
                type="password"
                value={user.newPassword}
                onChange={handleChange}
                disabled={loading}
                autoComplete="new-password"
                placeholder="Laissez vide pour ne pas le changer"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            {message && (
              <div className={`text-center text-sm border rounded p-2 ${
                message.startsWith('✅') ? 'text-green-600 border-green-200 bg-green-50'
                  : 'text-red-600 border-red-200 bg-red-50'
              }`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Mise à jour...' : 'Mettre à jour'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
