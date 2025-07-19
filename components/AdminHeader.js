'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FiUser, FiLogOut } from 'react-icons/fi'

export default function AdminHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const [isLogged, setIsLogged] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('admin-auth')
    if (!token) {
      router.replace('/admin')
    } else {
      setIsLogged(true)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('admin-auth')
    router.push('/admin')
  }

  if (!isLogged) return null

  const navLink = (href, label) => {
    const isActive = pathname === href
    return (
      <Link
        href={href}
        className="relative px-3 py-2 text-[17px] font-medium text-gray-700 hover:text-blue-600 transition"
      >
        {label}
        <span
          className={`
            absolute left-1/2 -translate-x-1/2 bottom-0 h-[2px] rounded-full bg-blue-600 transition-all duration-300
            ${isActive ? 'w-10 opacity-100' : 'w-0 opacity-0'}
          `}
        />
      </Link>
    )
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* ✅ Logo */}
        <Link href="/admin/dashboard" className="text-2xl font-bold tracking-tight text-gray-800 flex items-center gap-1">
          <span className="font-serif">Floor</span>
          <span className="text-blue-600 font-serif">&</span>
          <span className="font-serif">Design</span>
        </Link>

        {/* ✅ Navigation */}
        <nav className="flex flex-wrap justify-center gap-4">
          {navLink('/admin/produits', 'Produits')}
          {navLink('/admin/ajouter-produit', 'Ajouter Produit')}
          {navLink('/admin/palette-couleurs', 'Palette Couleurs')}
        </nav>

        {/* ✅ Profil & Logout */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/profil"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition text-base"
          >
            <FiUser size={18} />
            <span className="hidden sm:inline font-medium">Profil</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-full text-sm transition"
          >
            <FiLogOut size={16} />
            <span className="hidden sm:inline font-medium">Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}
