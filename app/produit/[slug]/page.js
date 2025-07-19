// app/produit/[slug]/page.js

import ClientProduitVoir from '@/components/ClientProduitVoir'

export default function ProductPage({ params }) {
  return <ClientProduitVoir slug={params.slug} />
}
