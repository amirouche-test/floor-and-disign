'use client'

import { useEffect } from 'react'

export default function ImageUpload({ onUpload }) {
  useEffect(() => {
    // Charger le widget quand le script est prêt
    if (!window.cloudinary) return

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      },
      (error, result) => {
        if (!error && result.event === 'success') {
        //   console.log('Upload réussi !', result.info)
          onUpload(result.info.secure_url)
        }
      }
    )

    // Rendre la fonction accessible
    window.openCloudinaryWidget = () => widget.open()
  }, [onUpload])

  return (
    <button
      type="button"
      onClick={() => window.openCloudinaryWidget()}
      style={{ padding: '8px 12px', background: '#3182ce', color: '#fff' }}
    >
      Uploader une image
    </button>
  )
}