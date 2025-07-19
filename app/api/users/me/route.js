// app/api/users/me/route.js

import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(req) {
  try {
    await connectDB()

    const token = req.cookies.get('token')?.value
    if (!token) return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.id).select('-password')
    if (!user) return NextResponse.json({ message: 'Utilisateur introuvable' }, { status: 404 })

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
