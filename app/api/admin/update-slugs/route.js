// app/api/admin/update-slugs/route.js

import { connectDB } from '@/lib/mongodb'
import Product from '@/models/Product'
import { getSlugByName } from '@/utils/slug'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    await connectDB()

    const products = await Product.find({ slug: { $exists: false } })

    let updatedCount = 0

    for (let product of products) {
      let baseSlug = getSlugByName(product.name)
      let uniqueSlug = baseSlug
      let counter = 1

      while (await Product.findOne({ slug: uniqueSlug })) {
        uniqueSlug = `${baseSlug}-${counter}`
        counter++
      }

      product.slug = uniqueSlug
      await product.save()
      updatedCount++
    }

    return NextResponse.json({
      message: `✅ Mise à jour terminée.`,
      updated: updatedCount
    })
  } catch (error) {
    console.error('Erreur update slugs:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
