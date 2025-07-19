import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import PaletteCouleur from '@/models/PaletteCouleur'


export async function PUT(req, { params }) {
    try {
      await connectDB()
      const body = await req.json()
      const { nom, hex } = body
  
      // Vérifier si un autre document porte déjà ce nom (case insensitive)
      const existing = await PaletteCouleur.findOne({ 
        nom: { $regex: new RegExp(`^${nom}$`, 'i') }, 
        _id: { $ne: params.id } // exclure la couleur actuelle
      })
  
      if (existing) {
        return NextResponse.json({ message: 'Une autre couleur porte déjà ce nom.' }, { status: 400 })
      }
  
      const updated = await PaletteCouleur.findByIdAndUpdate(
        params.id,
        { nom, hex },
        { new: true }
      )
  
      if (!updated) {
        return NextResponse.json({ message: 'Couleur non trouvée' }, { status: 404 })
      }
  
      return NextResponse.json(updated)
    } catch (error) {
      console.error(error)
      return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 })
    }
  }
  

export async function DELETE(req, { params }) {
  try {
    await connectDB()
    const deleted = await PaletteCouleur.findByIdAndDelete(params.id)
    if (!deleted) return NextResponse.json({ message: 'Couleur non trouvée' }, { status: 404 })
    return NextResponse.json({ message: 'Supprimée avec succès' })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
