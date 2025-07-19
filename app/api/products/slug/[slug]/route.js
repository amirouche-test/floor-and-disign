// app/api/product/slug/[slug]/route.js

import { getNameBySlug } from '@/utils/slug'
import { connectDB } from '@/lib/mongodb'
import Product from '@/models/Product'
import { NextResponse } from 'next/server'

export async function GET(req, { params }) {
  try {
    await connectDB()
    const regex = getNameBySlug(params.slug)
    const product = await Product.findOne({ name: regex })

    console.log("slug: " + regex);
    if (!product) {
      return NextResponse.json({ message: 'Produit non trouvé' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Erreur GET produit par slug:', error)
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
