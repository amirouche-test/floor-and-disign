// components/AdminProduitVoir

'use client'

import { useEffect, useState } from 'react'
import { RefreshCcw, Download } from 'lucide-react'
import { toPng } from 'html-to-image'

export default function AdminProduitVoir({ id }) {
  const [product, setProduct] = useState(null)
  const [palette, setPalette] = useState([])
  const [selectedColors, setSelectedColors] = useState({})
  const [selectedMotif, setSelectedMotif] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // ✅ Récupération des données
  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [prodRes, paletteRes] = await Promise.all([
        fetch(`/api/products/${id}`),
        fetch('/api/palette-couleurs')
      ])
      if (!prodRes.ok) throw new Error('Erreur chargement produit.')
      if (!paletteRes.ok) throw new Error('Erreur chargement palette.')

      const productData = await prodRes.json()
      const paletteData = await paletteRes.json()

      setProduct(productData)
      setPalette(paletteData)

      const sortedMotifs = [...productData.motifs].sort((a, b) => a.nom.localeCompare(b.nom))
      const initColors = {}
      sortedMotifs.forEach(m => {
        initColors[m.nom] = m.calques[0]?.couleur || null
      })
      setSelectedColors(initColors)
      setSelectedMotif(sortedMotifs[0] || null)

      // Petit délai pour effet fluide
      setTimeout(() => setLoading(false), 500)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) fetchData()
  }, [id])

  const resetSelections = () => {
    if (!product) return
    const sortedMotifs = [...product.motifs].sort((a, b) => a.nom.localeCompare(b.nom))
    const initColors = {}
    sortedMotifs.forEach(m => {
      initColors[m.nom] = m.calques[0]?.couleur || null
    })
    setSelectedColors(initColors)
    setSelectedMotif(sortedMotifs[0] || null)
  }

  const downloadImage = async () => {
    const node = document.getElementById('preview-zone')
    if (!node) return
    try {
      const dataUrl = await toPng(node, { cacheBust: true })
      const link = document.createElement('a')
      link.download = `${product.name}-preview.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error('Erreur lors du téléchargement', err)
    }
  }

  const sortedMotifs = product ? [...product.motifs].sort((a, b) => a.nom.localeCompare(b.nom)) : []

  return (
    <div className="max-w-7xl mx-auto px-4 font-sans text-gray-800 text-base mt-8 mb-16">
      
      {/* ✅ Loader */}
      {loading ? (
        <div className="flex gap-6 flex-wrap lg:flex-nowrap animate-pulse">
          <div className="w-[450px] h-[450px] bg-gray-100 rounded-2xl shadow"></div>
          <div className="flex-1 flex flex-col space-y-6 items-end">
            <div className="flex flex-row-reverse items-center gap-4">
              <div className="w-24 h-24 bg-gray-200 rounded-2xl"></div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-200 rounded w-40"></div>
                <div className="h-4 bg-gray-200 rounded w-28"></div>
                <div className="h-5 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
            <div className="flex gap-2">
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className="h-8 w-20 bg-gray-200 rounded-full"></div>
              ))}
            </div>
            <div className="flex gap-1 flex-wrap">
              {[...Array(6)].map((_, idx) => (
                <div key={idx} className="w-6 h-6 rounded-full bg-gray-200"></div>
              ))}
            </div>
            <div className="h-20 bg-gray-200 rounded-xl w-full max-w-md"></div>
          </div>
        </div>
      ) : error ? (
        <div className="text-center mt-10 text-red-600 font-semibold space-y-2">
          <p>{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
          >
            Réessayer
          </button>
        </div>
      ) : product ? (
        <div className="flex gap-6 flex-wrap lg:flex-nowrap mt-4">
          
          {/* ✅ Zone gauche */}
          <div className="relative w-[450px] mx-auto overflow-hidden rounded-2xl shadow-lg bg-white border">
            <div className="absolute top-2 right-2 flex space-x-2 z-30">
              <button onClick={downloadImage} className="p-2 bg-gray-50 cursor-pointer rounded-full border hover:bg-gray-100 transition">
                <Download size={20} className="text-gray-700" />
              </button>
              <button onClick={resetSelections} className="p-2 bg-gray-50 cursor-pointer rounded-full border hover:bg-gray-100 transition">
                <RefreshCcw size={20} className="text-gray-700" />
              </button>
            </div>
            <div id="preview-zone" className="relative w-full h-full">
              <div className="absolute inset-0">
                {product.motifs.map(motif => {
                  const color = selectedColors[motif.nom]
                  return motif.calques
                    .filter(c => c.couleur === color)
                    .map((calque, idx) => (
                      <img
                        key={`${motif.nom}-${idx}`}
                        src={calque.image}
                        alt=""
                        className="absolute top-0 left-0 h-full"
                        style={{ width: 'auto' }}
                      />
                    ))
                })}
              </div>
              <img src="/Image-prototype-scaled.png" alt="Prototype" className="block w-full h-auto relative z-10" />
            </div>
          </div>

          {/* ✅ Zone droite */}
          <div className="flex-1 flex flex-col space-y-6 items-end text-right">
            <div className="flex flex-row-reverse items-center gap-4">
              <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-2xl shadow" />
              <div>
                <h2 className="text-2xl font-semibold">{product.name}</h2>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-sm font-medium text-blue-800 bg-blue-100">
                  {product.category}
                </span>
                <p className="text-gray-700 mt-1 text-lg">💰 {product.price} DA</p>
              </div>
            </div>

            <div className="flex flex-row-reverse flex-wrap gap-2 w-full justify-start">
              {sortedMotifs.map((motif, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedMotif(motif)}
                  className={`px-4 py-2 text-base rounded-full border transition
                    ${selectedMotif?.nom === motif.nom
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-gray-50 hover:bg-gray-100'}`}
                >
                  {motif.nom}
                </button>
              ))}
            </div>

            {selectedMotif && (
              <div className="w-full max-w-xl h-24 overflow-y-auto flex flex-row-reverse flex-wrap gap-1 rounded-2xl p-2 bg-gray-50 shadow-inner">
                {selectedMotif.calques.map((calque, idx) => {
                  const paletteColor = palette.find(p => p.nom === calque.couleur)
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedColors(prev => ({ ...prev, [selectedMotif.nom]: calque.couleur }))}
                      className={`w-6 h-6 rounded-full border
                        ${selectedColors[selectedMotif.nom] === calque.couleur
                          ? 'ring-2 ring-blue-600 border-blue-400'
                          : 'hover:scale-110 border-gray-300'}`}
                      style={{ backgroundColor: paletteColor?.hex || calque.couleur }}
                    />
                  )
                })}
              </div>
            )}

            <div className="bg-gray-50 rounded-xl p-4 shadow text-gray-700 text-base leading-relaxed max-w-md">
              {product.description}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center mt-10 text-gray-500">Produit non trouvé...</div>
      )}
    </div>
  )
}
