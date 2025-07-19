// lib/auth.js
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export function getCurrentUser() {
  const token = cookies().get('token')?.value

  if (!token) return null

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return decoded
  } catch (err) {
    return null
  }
}
