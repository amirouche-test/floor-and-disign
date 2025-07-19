// lib/jwt.js

import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'secret_key_dev'

export function generateToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' })
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET)
}
