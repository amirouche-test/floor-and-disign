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
  const [loading, setLoading] = useState(true)
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

      // ✅ Simuler un petit délai pour un effet plus fluide
      setTimeout(() => setLoading(false), 600)
    } catch (err) {
      setError(err.message)
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) return <div className="text-red-600 text-center mt-10 text-lg">{error}</div>

  const sortedMotifs = [...product.motifs].sort((a, b) => a.nom.localeCompare(b.nom))

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 font-sans text-gray-800 text-base">
        {/* ✅ Top bar */}
        <div className="flex justify-between items-center py-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => window.history.back()}
            className=" cursor-pointer flex items-center gap-2 text-xl text-neutral-700 hover:text-blue-600 transition-colors duration-200"
          >
            <ChevronLeft className="w-6 h-6 text-blue-500" />
            <span>Retour</span>
          </button>

          <p className="text-2xl font-semibold italic tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 drop-shadow-sm hover:drop-shadow-md transition">
            Composez votre design
          </p>

          <Link href="/">
            <img src="/logo-2.svg" alt="Logo" className="h-10 w-auto" />
          </Link>
        </div>

        {/* Contenu principal */}
        <div className="flex gap-8 mt-10">
          {/* Zone gauche */}
          <div className="relative w-[450px] mx-auto overflow-hidden rounded-2xl shadow-lg bg-white">
            <div className="absolute top-2 right-2 flex space-x-2 z-30">
              <button onClick={downloadImage} className="p-2 bg-gray-50 rounded-full border hover:bg-gray-100 transition">
                <Download size={22} className="text-gray-600" />
              </button>
              <button onClick={resetSelections} className="p-2 bg-gray-50 rounded-full border hover:bg-gray-100 transition">
                <RefreshCcw size={22} className="text-gray-600" />
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
          <div className="flex-1 flex flex-col space-y-6 items-end text-right">
            <div className="flex flex-row-reverse items-center gap-4">
              <img src={product.image} alt={product.name} className="w-32 h-32 object-cover rounded-2xl shadow-md" />
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
                  className={`px-4 py-2 text-base rounded-full border transition ${
                    selectedMotif?.nom === motif.nom
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {motif.nom}
                </button>
              ))}
            </div>

            
            {selectedMotif && (
              <div className="w-full max-w-xl h-38 overflow-y-auto flex flex-row-reverse flex-wrap gap-1 rounded-2xl p-3 bg-gray-50 shadow-inner">
                {selectedMotif.calques.map((calque, idx) => {
                  const paletteColor = palette.find(p => p.nom === calque.couleur)
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedColors(prev => ({ ...prev, [selectedMotif.nom]: calque.couleur }))}
                      className={`w-5 h-5 rounded-full border transition ${
                        selectedColors[selectedMotif.nom] === calque.couleur ? 'ring-2 ring-blue-600' : 'hover:scale-110'
                      }`}
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

        <div className="h-10" />
      </div>

      <Footer />
    </>
  )
}
