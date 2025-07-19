'use client'

import { useEffect, useState } from 'react'
import { RefreshCcw, Download, ChevronLeft } from 'lucide-react'
import { toPng } from 'html-to-image'
import Link from 'next/link'
import Footer from './Footer'

export default function ClientProduitVoir({ slug }) {
  const [product, setProduct] = useState(null)
  const [palette, setPalette] = useState([])
  const [selectedColors, setSelectedColors] = useState({})
  const [selectedMotif, setSelectedMotif] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [prodRes, paletteRes] = await Promise.all([
        fetch(`/api/products/slug/${slug}`),
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
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (slug) fetchData()
  }, [slug])

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

  if (loading) return <div className="flex justify-center mt-20">Chargement...</div>
  if (error) return <div className="text-red-600 text-center mt-10">{error}</div>
  if (!product) return <div className="text-center mt-10">Produit non trouvé...</div>

  const sortedMotifs = [...product.motifs].sort((a, b) => a.nom.localeCompare(b.nom))

  return (
    <>
      {/* ✅ Container centré */}
      <div className="max-w-7xl mx-auto px-4 font-sans">

        {/* Top bar */}
        <div className="flex justify-between items-center py-3 mb-6 border-b">
          <button
            onClick={() => window.history.back()}
            className="flex items-center text-gray-700 hover:text-black"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span>Retour</span>
          </button>

          <p className="text-sm text-gray-600 italic">Créez votre design unique</p>

          <Link href="/">
            <img src="/logo-2.svg" alt="Logo" className="h-10 w-auto" />
          </Link>
        </div>

        {/* Contenu principal */}
        <div className="flex gap-8 mt-10">
          {/* Zone gauche */}
          <div className="relative w-[450px] mx-auto overflow-hidden rounded-xl shadow border">
            <div className="absolute top-2 right-2 flex space-x-2 z-30">
              <button onClick={downloadImage} className="p-2 bg-white rounded-full border hover:bg-gray-100">
                <Download size={20} />
              </button>
              <button onClick={resetSelections} className="p-2 bg-white rounded-full border hover:bg-gray-100">
                <RefreshCcw size={20} />
              </button>
            </div>
            <div id="preview-zone" className="relative w-full h-full">
              <div className="absolute inset-0">
                {product.motifs.map(motif => {
                  const color = selectedColors[motif.nom]
                  return motif.calques
                    .filter(c => c.couleur === color)
                    .map((calque, idx) => (
                      <img key={idx} src={calque.image} alt="" className="absolute top-0 left-0 h-full" style={{ width: 'auto' }} />
                    ))
                })}
              </div>
              <img src="/Image-prototype-scaled.png" alt="Prototype" className="block w-full h-auto relative z-10" />
            </div>
          </div>

          {/* Zone droite */}
          <div className="flex-1 flex flex-col space-y-5 items-end text-right">
            <div className="flex flex-row-reverse items-center gap-4">
              <img src={product.image} alt={product.name} className="w-28 h-28 object-cover rounded-xl border shadow" />
              <div>
                <h2 className="text-2xl font-semibold">{product.name}</h2>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium text-blue-800 bg-blue-100">
                {product.category}
              </span>
                <p className="text-gray-600">💰 {product.price} DA</p>
              </div>
            </div>

            <div className="flex flex-row-reverse flex-wrap gap-2 w-full justify-start">
              {sortedMotifs.map((motif, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedMotif(motif)}
                  className={`px-4 py-1.5 text-sm rounded-full border transition ${
                    selectedMotif?.nom === motif.nom ? 'bg-blue-600 text-white' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {motif.nom}
                </button>
              ))}
            </div>

            {selectedMotif && (
              <div className="w-full max-w-md h-32 overflow-y-auto flex flex-row-reverse flex-wrap gap-2 border rounded-xl p-2 shadow-sm">
                {selectedMotif.calques.map((calque, idx) => {
                  const paletteColor = palette.find(p => p.nom === calque.couleur)
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedColors(prev => ({ ...prev, [selectedMotif.nom]: calque.couleur }))}
                      className={`w-7 h-7 rounded-full border transition ${
                        selectedColors[selectedMotif.nom] === calque.couleur ? 'ring-2 ring-blue-600' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: paletteColor?.hex || calque.couleur }}
                    />
                  )
                })}
              </div>
            )}

            {/* Description */}
            <div className="text-gray-700 text-sm leading-relaxed max-w-md mt-4 border-t pt-2">
              {product.description}
            </div>
          </div>
        </div>

        {/* Espace avant footer */}
        <div className="h-10" />
      </div>

      {/* ✅ Footer full width */}
      <Footer />
    </>
  )
}
