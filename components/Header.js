'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`
        fixed top-0 left-0 w-full z-50 font-sans
        transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${scrolled 
          ? 'bg-white/80 text-black shadow backdrop-blur-md scale-100 opacity-100' 
          : 'bg-transparent text-white scale-100 opacity-100'}
      `}
      style={{
        transform: scrolled ? 'translateY(0)' : 'translateY(0)',
      }}
    >
      {/* Partie haute : logo + liens */}
      <div
        className={`
          flex justify-around items-center px-2
          transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${scrolled ? 'py-2' : 'py-4'}
        `}
        style={{
          transform: scrolled ? 'translateY(0)' : 'translateY(0)',
        }}
      >
        {/* GAUCHE */}
        <Link
          href="/la-marque"
          className="text-lg font-medium hover:text-blue-400 transition-colors"
        >
          LA MARQUE
        </Link>

        {/* LOGO */}
        <Link href="/">
          <img
            src={scrolled ? '/logo-2.svg' : '/logo.svg'}
            alt="Logo"
            className={`
              w-24 h-auto object-contain transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
              ${scrolled ? 'scale-95' : 'scale-100'}
            `}
          />
        </Link>

        {/* DROITE */}
        <Link
          href="/simulateur-3d"
          className="text-lg font-medium hover:text-blue-400 transition-colors"
        >
          SIMULATEUR 3D
        </Link>
      </div>

      {/* Catégories avec slide + fade pro */}
      <nav
        className={`
          transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${scrolled 
            ? 'translate-y-[-4px] opacity-95 py-1' 
            : 'translate-y-0 opacity-100 py-3'}
        `}
      >
        <ul className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-10 text-sm sm:text-base font-semibold">
          {[
            'INTEMPOREL',
            'GRAPHIQUES',
            'PRESTIGE',
            'ETHINIQUE',
            'BAGUETTES',
            'INSPIRATION',
          ].map((name) => (
            <li key={name}>
              <Link
                href={`/categorie/${name.toLowerCase()}`}
                className="relative hover:text-blue-400 transition-colors duration-300
                  after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[1px]
                  after:w-0 hover:after:w-full after:bg-blue-500 after:transition-all after:duration-500"
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
