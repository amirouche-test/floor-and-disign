'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function CategoryProducts({ category }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const pageSize = 6

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`/api/products/category/${category}?limit=${pageSize}&page=${page}`)
        if (!res.ok) throw new Error('Erreur lors du chargement des produits.')
        const data = await res.json()
        setProducts(data.products || [])
        setTotalPages(data.totalPages || 1)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [category, page])

  if (error) {
    return (
      <div className="text-red-600 text-center mt-10 text-lg">{error}</div>
    )
  }

  if (!loading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-16">
        <span className="text-2xl md:text-3xl font-light text-gray-700 mb-2">Aucun produit trouvé</span>
        <p className="text-gray-500 text-base md:text-lg max-w-md text-center">
          Nous n’avons pas encore de produits pour cette catégorie.
          Revenez bientôt ou explorez d’autres catégories !
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-[90rem] mx-auto px-4 md:px-8 py-8 mt-8">
      {/* ✅ Titre et sous-titre toujours visibles */}
      <h2 className="text-center text-4xl md:text-5xl font-light tracking-wide mb-4 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 bg-clip-text text-transparent">
        Nos Produits {category}
      </h2>
      <p className="text-center text-gray-500 max-w-3xl mx-auto mb-12 text-lg md:text-xl leading-relaxed font-light">
        Explorez notre sélection exclusive pour la catégorie {category}.
      </p>

      {/* ✅ Grid des produits (avec loader) */}
      <div className="flex justify-center flex-wrap gap-3 md:gap-4 lg:gap-5 min-h-[250px]">
        {loading
          ? [...Array(pageSize)].map((_, idx) => (
              <div
                key={idx}
                className="
                  rounded-xl bg-gray-100 shadow animate-pulse
                  w-28 sm:w-30 md:w-34 lg:w-38 xl:w-42
                  aspect-[4/4.5]
                "
              ></div>
            ))
          : products.map((product) => (
              <Link
                key={product._id}
                href={`/produit/${product.slug}`}
                className="
                  group block 
                  w-28 sm:w-30 md:w-34 lg:w-38 xl:w-42  
                  rounded-xl overflow-hidden bg-white shadow 
                  hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1
                "
              >
                <div className="relative aspect-[4/4.5] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-1 md:p-2 text-center">
                  <h3 className="text-gray-800 font-semibold text-[10px] sm:text-xs md:text-sm lg:text-base line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-700 mt-0.5 text-[10px] sm:text-xs md:text-sm font-medium">
                    {product.price} DA
                  </p>
                </div>
              </Link>
            ))}
      </div>

      {/* ✅ Pagination toujours affichée, même en loading */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-3">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0 || loading}
            className="p-2 md:p-3 rounded-full bg-white border border-gray-400 hover:bg-gray-100 transition disabled:opacity-30 shadow flex items-center justify-center"
          >
            <ChevronLeft size={20} className="text-gray-700" />
          </button>
          <span className="text-gray-700 font-medium text-sm md:text-base">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
            disabled={page >= totalPages - 1 || loading}
            className="p-2 md:p-3 rounded-full bg-white border border-gray-400 hover:bg-gray-100 transition disabled:opacity-30 shadow flex items-center justify-center"
          >
            <ChevronRight size={20} className="text-gray-700" />
          </button>
        </div>
      )}
    </div>
  )
}
