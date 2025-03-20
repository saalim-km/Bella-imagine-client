import { CategoryManagement } from '@/components/admin/category/Category'
import { AdminLayout } from '@/components/admin/layout/AdminLayout'

const CategoryPage = () => {
  return (
    <AdminLayout>
        <div>
            <CategoryManagement/>
        </div>
    </AdminLayout>
  )
}

export default CategoryPage