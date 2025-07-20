'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function CategoryHeader({ activeCategory }) {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Helper pour savoir si un lien est actif
  const isActiveLink = (href) => pathname === href

  return (
    <header
      className={`
        fixed top-0 left-0 w-full z-50 font-sans
        transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
        bg-gray-50/90 shadow backdrop-blur
      `}
    >
      {/* Partie haute : logo + liens */}
      <div className="flex justify-around items-center px-2 py-2">
        {/* GAUCHE */}
        <Link
          href="/la-marque"
          className={`
            relative text-lg font-medium transition-colors duration-300
            ${isActiveLink('/la-marque') ? 'text-blue-600' : 'text-black hover:text-blue-500'}
            after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[1px]
            after:transition-all after:duration-500
            ${isActiveLink('/la-marque') ? 'after:w-full after:bg-blue-600' : 'after:w-0 hover:after:w-full after:bg-blue-500'}
          `}
        >
          LA MARQUE
        </Link>

        {/* LOGO */}
        <Link href="/">
          <img
            src="/logo-2.svg"
            alt="Logo"
            className="w-24 h-auto object-contain"
          />
        </Link>

        {/* DROITE */}
        <Link
          href="/simulateur-3d"
          className={`
            relative text-lg font-medium transition-colors duration-300
            ${isActiveLink('/simulateur-3d') ? 'text-blue-600' : 'text-black hover:text-blue-500'}
            after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[1px]
            after:transition-all after:duration-500
            ${isActiveLink('/simulateur-3d') ? 'after:w-full after:bg-blue-600' : 'after:w-0 hover:after:w-full after:bg-blue-500'}
          `}
        >
          SIMULATEUR 3D
        </Link>
      </div>

      {/* Catégories */}
      <nav className="py-3">
        <ul className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-10 text-sm sm:text-base font-semibold text-black">
          {[
            'INTEMPOREL',
            'GRAPHIQUES',
            'PRESTIGE',
            'ETHNIQUE',
            'BAGUETTES',
            'INSPIRATION',
          ].map((name) => {
            const isActive = name.toLowerCase() === activeCategory?.toLowerCase()
            return (
              <li key={name}>
                <Link
                  href={`/categorie/${name.toLowerCase()}`}
                  className={`
                    relative transition-colors duration-300
                    ${isActive ? 'text-blue-600' : 'hover:text-blue-500'}
                    after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[1px]
                    after:transition-all after:duration-500
                    ${isActive ? 'after:w-full after:bg-blue-600' : 'after:w-0 hover:after:w-full after:bg-blue-500'}
                  `}
                >
                  {name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
