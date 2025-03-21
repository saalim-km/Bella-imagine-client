import { CategoryManagement } from '@/components/admin/category/Category'
import CategoryRequest from '@/components/admin/category/CategoryRequest'
import { AdminLayout } from '@/components/admin/layout/AdminLayout'

const CategoryPage = () => {
  return (
    <AdminLayout>
        <div>
            <CategoryManagement/>
            <CategoryRequest/>
        </div>
    </AdminLayout>
  )
}

export default CategoryPage