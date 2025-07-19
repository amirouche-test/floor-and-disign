// app/admin/produits/[id]/page.js
import AdminProduitVoir from '@/components/AdminProduitVoir'

export default function Page({ params }) {
  return <AdminProduitVoir id={params.id} />
}
