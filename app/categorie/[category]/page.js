import CategoryHeader from '@/components/CategoryHeader'
import CategoryProducts from '@/components/CategoryProducts'

export default function CategoryPage({ params }) {
  const category = params.category

  return (
    <div className="flex flex-col min-h-screen">
      <CategoryHeader activeCategory={category} />
      <CategoryProducts category={category} />
    </div>
  )
}
