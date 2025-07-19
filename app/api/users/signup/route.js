// app/api/users/signup/route.js

import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(req) {
  try {
    const { name, email, password } = await req.json()

    await connectDB()

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: 'Email déjà utilisé' }, { status: 400 })
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10)

    // Créer un nouvel utilisateur
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    })

    return NextResponse.json({ message: 'Inscription réussie', userId: newUser._id }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
