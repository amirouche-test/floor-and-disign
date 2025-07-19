// models/Product.js

import mongoose from 'mongoose'

const CalqueSchema = new mongoose.Schema({
  couleur: String,
  image: String, // URL Cloudinary
})

const MotifSchema = new mongoose.Schema({
  nom: String,
  calques: [CalqueSchema],
})

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    image: String, // image principale (URL Cloudinary)
    category: [String],
    description: String,
    price: Number, // ✅ nouveau champ prix
    motifs: [MotifSchema],
  },
  {
    timestamps: true, // ✅ ajoute createdAt et updatedAt
  }
)

export default mongoose.models.Product || mongoose.model('Product', ProductSchema)
