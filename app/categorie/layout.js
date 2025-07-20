// app/categorie/layout.jsx
import CategoryHeader from '@/components/CategoryHeader'
import Footer from '@/components/Footer'

export default function CategoryLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <CategoryHeader />
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 mt-24">
        {children}
      </main>
      <Footer />
    </div>
  )
}
