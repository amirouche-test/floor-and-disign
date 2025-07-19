// app/api/users/logout/route.js

import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = NextResponse.json(
      { message: 'Déconnexion réussie' },
      { status: 200 }
    )

    // Supprimer le cookie (ex: "token")
    response.cookies.set('token', '', {
      httpOnly: true,
      expires: new Date(0), // Expire immédiatement
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { message: 'Erreur lors de la déconnexion' },
      { status: 500 }
    )
  }
}
