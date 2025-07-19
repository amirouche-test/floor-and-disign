'use client'

import { useState } from 'react'
import DossierPreview from '@/components/DossierPreview'
import Toast from '@/components/Toast'
import { ArchiveBoxIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline'

const CATEGORIES = [
  'INTEMPOREL',
  'GRAPHIQUES',
  'PRESTIGE',
  'ETHINIQUE',
  'BAGUETTES',
  'INSPIRATION',
]

const uploadToCloudinary = async (file, publicId, folder) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)
  formData.append('folder', folder)
  formData.append('public_id', publicId)

  const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, {
    method: 'POST',
    body: formData,
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error?.message || 'Erreur Cloudinary')
  return data.secure_url
}

export default function AjouterProduitPage() {
  const [structure, setStructure] = useState(null)
  const [description, setDescription] = useState('')
  const [selectedCategories, setSelectedCategories] = useState([])
  const [price, setPrice] = useState('')
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [popup, setPopup] = useState({ message: '', type: '' })

  const handleFilesSelection = (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return

    const result = { productName: '', imagePrincipale: null, motifs: {} }

    files.forEach((file) => {
      const parts = file.webkitRelativePath.split('/')
      if (!result.productName) result.productName = parts[0]

      if (parts.length === 2) {
        result.imagePrincipale = file
      } else if (parts.length === 3) {
        const motif = parts[1]
        const calqueNom = parts[2].replace(/\.[^/.]+$/, '')
        if (!result.motifs[motif]) result.motifs[motif] = []
        result.motifs[motif].push({ couleur: calqueNom, file })
      }
    })

    setStructure(result)
  }

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const showPopup = (message, type = 'info') => {
    setPopup({ message, type })
    setTimeout(() => setPopup({ message: '', type: '' }), 3000)
  }

  const closePopup = () => {
    setPopup({ message: '', type: '' })
  }

  const handleUploadAndSave = async () => {
    if (!structure || !description || selectedCategories.length === 0 || !price) {
      showPopup('Veuillez remplir tous les champs requis.', 'error')
      return
    }

    try {
      // ✏️ Vérifier si le produit existe déjà avant d'uploader
      const checkRes = await fetch('/api/products/exists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: structure.productName }),
      })

      const checkData = await checkRes.json()
      if (checkData.exists) {
        showPopup('Un produit avec ce nom existe déjà.', 'error')
        return
      }
    } catch (err) {
      console.error(err)
      showPopup('Erreur lors de la vérification du produit.', 'error')
      return
    }

    setLoading(true)
    setProgress(0)

    try {
      const baseFolder = `produits/${structure.productName}`
      const totalFiles = 1 + Object.values(structure.motifs).reduce((sum, motif) => sum + motif.length, 0)
      let uploaded = 0

      const imageUrl = await uploadToCloudinary(structure.imagePrincipale, 'imagePrincipale', baseFolder)
      uploaded += 1
      setProgress(Math.round((uploaded / totalFiles) * 100))

      const motifs = {}
      for (const motifNom of Object.keys(structure.motifs)) {
        motifs[motifNom] = []

        for (const calque of structure.motifs[motifNom]) {
          const url = await uploadToCloudinary(calque.file, calque.couleur, `${baseFolder}/${motifNom}`)
          motifs[motifNom].push({ couleur: calque.couleur, image: url })

          uploaded += 1
          setProgress(Math.round((uploaded / totalFiles) * 100))
        }
      }

      const newProduct = {
        name: structure.productName,
        image: imageUrl,
        description,
        category: selectedCategories,
        price: parseFloat(price),
        motifs: Object.entries(motifs).map(([nom, calques]) => ({ nom, calques })),
      }

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      })

      if (!res.ok) {
        const err = await res.json()
        showPopup(`Erreur API: ${err.error}`, 'error')
      } else {
        showPopup('Produit enregistré avec succès 🎉', 'success')
        setStructure(null)
        setDescription('')
        setSelectedCategories([])
        setPrice('')
        setProgress(0)
      }
    } catch (err) {
      console.error(err)
      showPopup("Erreur lors de l'upload", 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative p-4 max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-800">
      {popup.message && (
        <Toast message={popup.message} type={popup.type} onClose={closePopup} />
      )}

      {/* Formulaire */}
      <div className="md:col-span-2 space-y-4 bg-white rounded-2xl shadow p-4">
        <div className="flex items-center gap-2 mb-4 pb-1 border-b border-gray-100">
          <ArchiveBoxIcon className="w-6 h-6 text-blue-700" />
          <h1 className="text-xl sm:text-2xl font-semibold text-blue-700">Ajouter un produit</h1>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">
              📁 Dossier du produit
            </label>
            <input
              type="file"
              webkitdirectory="true"
              directory=""
              multiple
              onChange={handleFilesSelection}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">
              📝 Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">
              🏷️ Catégories
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <label key={cat} className="flex items-center gap-1 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="accent-blue-600"
                  />
                  <span className="text-gray-700">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-500 mb-1">
              💰 Prix
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Ex: 49.99"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          disabled={!structure || loading}
          onClick={handleUploadAndSave}
          className="mt-2 inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl shadow hover:bg-blue-700 disabled:opacity-50 transition"
        >
          <CloudArrowUpIcon className="w-5 h-5" />
          {loading ? `⏳ Upload ${progress}%` : 'Uploader & Enregistrer'}
        </button>
      </div>

      {/* Aperçu */}
      <div className="md:col-span-1">
        <DossierPreview structure={structure} />
      </div>

      {loading && (
        <div className="fixed bottom-0 left-0 w-full h-2 bg-gray-200">
          <div
            className="bg-blue-600 h-2 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}
