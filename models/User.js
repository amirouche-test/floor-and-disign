// models/User.js

import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true })

// éviter de redéfinir le modèle à chaque fois
export default mongoose.models.User || mongoose.model('User', UserSchema)
