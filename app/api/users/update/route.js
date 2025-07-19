// app/api/users/update/route.js

import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function PUT(req) {
  try {
    await connectDB()

    // Lire le token depuis les cookies
    const token = req.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    // Vérifier et décoder le token
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      return NextResponse.json({ message: 'Token invalide' }, { status: 403 })
    }

    const { name, email, newPassword } = await req.json()

    const user = await User.findById(decoded.id)
    if (!user) {
      return NextResponse.json({ message: 'Utilisateur non trouvé' }, { status: 404 })
    }

    // Mise à jour des données
    if (name) user.name = name
    if (email) user.email = email
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      user.password = hashedPassword
    }

    await user.save()

    return NextResponse.json({ message: 'Profil mis à jour avec succès' })

  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
