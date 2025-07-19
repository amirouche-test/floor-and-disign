'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function useAdminAuthRedirect(redirectIfAuth = true) {
  const router = useRouter()

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('admin-auth')

    if (redirectIfAuth && isAuthenticated) {
      router.replace('/admin/dashboard')
    }

    if (!redirectIfAuth && !isAuthenticated) {
      router.replace('/admin')
    }
  }, [redirectIfAuth])
}
