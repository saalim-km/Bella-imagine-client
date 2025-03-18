import { CategoryManagement } from '@/components/admin/category/Category'
import { AdminLayout } from '@/components/admin/layout/AdminLayout'
import React from 'react'

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