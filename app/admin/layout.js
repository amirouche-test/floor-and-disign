'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import AdminHeader from '@/components/AdminHeader'
import AdminLoginPage from './page' // 👈 importer la page du formulaire

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const [isLogged, setIsLogged] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('admin-auth')
    setIsLogged(!!token)
  }, [])

  if (isLogged === null) return null // en attente

  // Si on est sur /admin et non connecté → afficher le formulaire
  if (pathname === '/admin' && !isLogged) {
    return <AdminLoginPage />
  }

  // Si connecté → layout complet avec header
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="p-6">{children}</main>
    </div>
  )
}
