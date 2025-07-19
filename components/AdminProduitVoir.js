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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Chargement initial
  const fetchData = async () => {
    try {
      setLoading(true)
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

      // Trier motifs
      const sortedMotifs = [...productData.motifs].sort((a, b) => a.nom.localeCompare(b.nom))

      // Initialiser couleurs avec le premier motif trié
      const initColors = {}
      sortedMotifs.forEach(m => {
        initColors[m.nom] = m.calques[0]?.couleur || null
      })
      setSelectedColors(initColors)
      setSelectedMotif(sortedMotifs[0] || null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) fetchData()
  }, [id])

  // Réinitialiser les sélections
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

  // Télécharger l’image finale (sans les boutons)
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

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-20">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-600 font-semibold space-y-2">
        <p>{error}</p>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
        >
          Réessayer
        </button>
      </div>
    )
  }

  if (!product) return <div className="text-center mt-10 text-gray-500">Produit non trouvé...</div>

  // Trier motifs par ordre alphabétique
  const sortedMotifs = [...product.motifs].sort((a, b) => a.nom.localeCompare(b.nom))

  return (
    <div className="flex gap-6 mt-10 max-w-7xl mx-auto px-4">
      
      {/* ✅ Zone gauche : calques */}
      <div className="relative w-[450px] mx-auto overflow-hidden rounded-xl shadow border">
        
        {/* Boutons au-dessus (pas dans le preview) */}
        <div className="absolute top-2 right-2 flex space-x-2 z-30">
          <button
            onClick={downloadImage}
            className="p-2 rounded-full bg-white border border-gray-300 shadow hover:bg-gray-100 transition"
            title="Télécharger"
          >
            <Download size={20} className="text-gray-700" />
          </button>
          <button
            onClick={resetSelections}
            className="p-2 rounded-full bg-white border border-gray-300 shadow hover:bg-gray-100 transition"
            title="Réinitialiser"
          >
            <RefreshCcw size={20} className="text-gray-700" />
          </button>
        </div>

        {/* Zone à exporter */}
        <div id="preview-zone" className="relative w-full h-full">
          {/* Calques superposés */}
          <div className="absolute inset-0 overflow-hidden">
            {product.motifs.map(motif => {
              const color = selectedColors[motif.nom]
              return motif.calques
                .filter(c => c.couleur === color)
                .map((calque, idx) => (
                  <img
                    key={`${motif.nom}-${idx}`}
                    src={calque.image}
                    alt={calque.couleur}
                    className="absolute top-0 left-0 h-full object-cover"
                    style={{ width: 'auto' }}
                  />
                ))
            })}
          </div>
          {/* Prototype devant */}
          <img
            src="/Image-prototype-scaled.png"
            alt="Prototype"
            className="block w-full h-auto relative z-10"
          />
        </div>
      </div>

      {/* ✅ Zone droite */}
      <div className="flex-1 flex flex-col space-y-5 items-end text-right">
        
        {/* Infos produit */}
        <div className="flex flex-row-reverse items-center gap-4">
          <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-xl border shadow" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">{product.name}</h2>
            <p className="text-gray-600">💰 {product.price} DA</p>
          </div>
        </div>

        {/* Boutons motifs */}
        <div className="flex flex-row-reverse flex-wrap gap-2 w-full justify-start">
          {sortedMotifs.map((motif, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedMotif(motif)}
              className={`px-4 py-1.5 text-sm rounded-full border shadow-sm transition
                ${selectedMotif?.nom === motif.nom
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-50 text-gray-800 hover:bg-gray-100 border-gray-300'}`}
            >
              {motif.nom}
            </button>
          ))}
        </div>

        {/* 🎨 Palette */}
        {selectedMotif && (
          <div className="w-80 h-24 overflow-y-auto flex flex-row-reverse flex-wrap gap-2 border rounded-xl p-2 shadow-sm">
            {selectedMotif.calques.map((calque, idx) => {
              const paletteColor = palette.find(p => p.nom === calque.couleur)
              return (
                <button
                  key={idx}
                  onClick={() =>
                    setSelectedColors(prev => ({ ...prev, [selectedMotif.nom]: calque.couleur }))
                  }
                  className={`w-6 h-6 rounded-full border
                    ${selectedColors[selectedMotif.nom] === calque.couleur
                      ? 'ring-2 ring-blue-600 border-blue-400'
                      : 'border-gray-300'}`}
                  style={{ backgroundColor: paletteColor?.hex || calque.couleur }}
                  title={calque.couleur}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
