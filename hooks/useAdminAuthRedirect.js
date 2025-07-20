'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function useAdminAuthRedirect(redirectIfAuth = true) {
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/users/me', { cache: 'no-store' })
        if (res.ok) {
          // Utilisateur connecté
          if (redirectIfAuth) {
            router.replace('/admin/dashboard')
          }
        } else {
          // Non connecté
          if (!redirectIfAuth) {
            router.replace('/admin')
          }
        }
      } catch (err) {
        console.error(err)
        if (!redirectIfAuth) {
          router.replace('/admin')
        }
      }
    }

    checkAuth()
  }, [redirectIfAuth])
}
