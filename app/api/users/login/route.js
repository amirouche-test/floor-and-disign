// app/api/users/login/route.js

import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(req) {
  try {
    const { email, password } = await req.json()

    await connectDB()

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ message: "Utilisateur non trouvé" }, { status: 404 })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return NextResponse.json({ message: "Mot de passe incorrect" }, { status: 401 })
    }

    // ✅ Créer le token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // ✅ Créer la réponse avec cookie
    const response = NextResponse.json({
      message: 'Connexion réussie',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    })

    // ✅ Définir le cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 jours
    })

    return response

  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
