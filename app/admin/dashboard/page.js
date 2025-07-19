'use client'

import AdminHeader from '@/components/AdminHeader'
import useAdminAuthRedirect from '@/hooks/useAdminAuthRedirect'

export default function AdminDashboardPage() {
  useAdminAuthRedirect(false)

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-10 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Bienvenue sur le tableau de bord</h1>

        {/* Contenu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Produits</h2>
            <p className="text-gray-600">Gérez vos produits ici.</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Utilisateurs</h2>
            <p className="text-gray-600">Voir les utilisateurs enregistrés.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
