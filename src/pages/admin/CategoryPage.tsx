import { CategoryManagement } from "@/components/admin/category/Category";
import CategoryRequest from "@/components/admin/category/CategoryRequest";
import { AdminLayout } from "@/components/layout/AdminLayout";

const CategoryPage = () => {
  return (
    <AdminLayout>
      <CategoryManagement />
      <CategoryRequest />
    </AdminLayout>
  );
};

export default CategoryPage;
