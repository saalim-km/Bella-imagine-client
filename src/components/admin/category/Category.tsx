import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  type CategoryType,
  useAllCategoryQuery,
  useUpdateCategoryMutation,
} from "@/hooks/admin/useAllCategory";
import { CategoryForm } from "./CategoryForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, type ColumnDef } from "@/components/common/Table";
import { handleError } from "@/utils/Error/error-handler.utils";
import { Input } from "@/components/ui/input";
import { LoadingBar } from "@/components/ui/LoadBar";
import { communityToast } from "@/components/ui/community-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Category } from "@/services/categories/categoryService";

export function CategoryManagement() {
  const [searchTerm, setSerachTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const { mutate: updateCategory } = useUpdateCategoryMutation();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null
  );
  const queryClient = useQueryClient();

  let filterOption;
  switch (filter) {
    case "active":
      filterOption = { status: true };
      break;
    case "inactive":
      filterOption = { status: false };
      break;
    default:
      filterOption = {};
  }

  const itemPerPage = 4;

  const { data, isLoading } = useAllCategoryQuery(
    {
      ...filterOption,
      search: appliedSearch,
    },
    { page: currentPage, limit: itemPerPage }
  );
  const totalCategories = data?.data.total || 0;
  const totalPages = Math.max(1, Math.ceil(totalCategories / itemPerPage));

  function handleEdit(category: CategoryType) {
    setSelectedCategory(category);
    setIsEditing(true);
    setShowForm(true);
  }

  function handleChangeSeaarchTerm(e: React.ChangeEvent<HTMLInputElement>) {
    setSerachTerm(e.target.value);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  function handleSearchSubmit() {
    setAppliedSearch(searchTerm);
  }

  async function handleToggleStatus(categoryId: string, status: boolean) {
    const querykey = [
      "category-list-admin",
      { ...filterOption!, search: appliedSearch },
      { page: currentPage, limit: itemPerPage },
    ];

    await queryClient.cancelQueries({ queryKey: querykey });
    const prevData = queryClient.getQueryData(querykey);
    queryClient.setQueryData(querykey, (oldData: any) => {
      if (!oldData) return oldData;

      const updatedDocs = oldData.data.data.map((category: Category) => {
        return category._id == categoryId
          ? { ...category, status: status ? false : true }
          : category;
      });

      return {
        ...oldData,
        data: {
          ...oldData.data,
          data: updatedDocs,
        },
      };
    });
    updateCategory(
      { id: categoryId },
      {
        onSuccess: (data: any) => {
          communityToast.success({ description: data?.message });
        },
        onError: (err) => {
          queryClient.setQueryData(querykey, prevData);
          handleError(err);
        },
      }
    );
  }

  function handleFormClose() {
    setIsEditing(false);
    setShowForm(false);
    setSelectedCategory(null);
  }

  function handlePageChange(page: number) {
    setCurrentPage(page);
  }

  function handleFilterChange(value: string) {
    setFilter(value);
    setCurrentPage(1);
  }

  const columns: ColumnDef<CategoryType>[] = [
    {
      id: "_id",
      header: "ID",
      accessorKey: "categoryId",
      cell: (category) => category.categoryId || "N/A",
      className: "w-[300px]",
    },
    {
      id: "title",
      header: "Title",
      accessorKey: "title",
    },
    {
      id: "status",
      header: "Status",
      cell: (category) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            category.status
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {category.status ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: (category) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={category.status}
            onCheckedChange={() =>
              handleToggleStatus(category._id, category.status)
            }
            value={category._id}
          />
          <Button
            variant={"outline"}
            size="sm"
            onClick={() => handleEdit(category)}
          >
            Edit
          </Button>
        </div>
      ),
      className: "w-[150px]",
    },
  ];

  if (isLoading) return <LoadingBar />;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Category Management</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2" /> Add Category
        </Button>
      </div>
      <div className="mb-4 flex gap-5">
        <div className="flex">
          <Input
            placeholder="Search clients..."
            className="w-[200px] rounded-r-none"
            value={searchTerm}
            onChange={handleChangeSeaarchTerm}
            onKeyDown={handleKeyDown}
          />
          <Button
            variant={"outline"}
            className="rounded-l-none"
            onClick={handleSearchSubmit}
          >
            Search
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Filter by status:</span>
          <Select value={filter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="active">Active Only</SelectItem>
              <SelectItem value="inactive">Inactive Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {showForm && (
        <CategoryForm
          filterOptions={{...filterOption,search:appliedSearch}}
          pagination={{ page: currentPage, limit: itemPerPage }}
          initialData={isEditing ? selectedCategory : null}
          onClose={handleFormClose}
        />
      )}

      <DataTable
        data={data?.data.data || []}
        columns={columns}
        currentPage={currentPage}
        totalPages={totalPages || 1}
        onPageChange={handlePageChange}
        emptyMessage="No categories found"
        isLoading={isLoading}
      />
    </div>
  );
}
