import { useState } from "react"
import { Plus } from "lucide-react"
import { CategoryList } from "./CategoryList"
import { CategoryForm } from "./categoryForm"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"

// Define the Category type
export interface Category {
  id: string
  name: string
  description: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// Mock data for demonstration
const initialCategories: Category[] = [
  {
    id: "1",
    name: "Wedding Photography",
    description: "Professional photography services for wedding ceremonies and receptions",
    isActive: true,
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
  },
  {
    id: "2",
    name: "Portrait Photography",
    description: "Professional portrait sessions for individuals, families, or groups",
    isActive: true,
    createdAt: new Date("2023-02-10"),
    updatedAt: new Date("2023-02-10"),
  },
  {
    id: "3",
    name: "Event Photography",
    description: "Photography services for corporate events, parties, and gatherings",
    isActive: true,
    createdAt: new Date("2023-03-05"),
    updatedAt: new Date("2023-03-05"),
  },
  {
    id: "4",
    name: "Commercial Photography",
    description: "Professional photography for products, real estate, and business needs",
    isActive: false,
    createdAt: new Date("2023-04-20"),
    updatedAt: new Date("2023-05-15"),
  },
]

export function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("list")

  // Function to add a new category
  const handleAddCategory = (category: Omit<Category, "id" | "createdAt" | "updatedAt">) => {
    const newCategory: Category = {
      ...category,
      id: Math.random().toString(36).substring(2, 9), // Generate a random ID
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    setCategories([...categories, newCategory])
    toast('category added')
    setActiveTab("list")
  }

  // Function to update an existing category
  const handleUpdateCategory = (updatedCategory: Category) => {
    const updatedCategories = categories.map((category) =>
      category.id === updatedCategory.id ? { ...updatedCategory, updatedAt: new Date() } : category,
    )

    setCategories(updatedCategories)
    setSelectedCategory(null)
    setIsEditing(false)
    toast.success('category updated')
    setActiveTab("list")
  }

  // Function to toggle category active status
  const handleToggleStatus = (id: string) => {
    const updatedCategories = categories.map((category) =>
      category.id === id ? { ...category, isActive: !category.isActive, updatedAt: new Date() } : category,
    )

    const targetCategory = categories.find((category) => category.id === id)
    const newStatus = !targetCategory?.isActive

    setCategories(updatedCategories)
    toast.success('category activated')
  }

  // Function to edit a category
  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category)
    setIsEditing(true)
    setActiveTab("form")
  }

  // Function to cancel editing
  const handleCancelEdit = () => {
    setSelectedCategory(null)
    setIsEditing(false)
    setActiveTab("list")
  }

  return (
    <Card className="p-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="list">Categories</TabsTrigger>
            <TabsTrigger value="form">{isEditing ? "Edit Category" : "Add Category"}</TabsTrigger>
          </TabsList>
          {activeTab === "list" && (
            <Button
              onClick={() => {
                setIsEditing(false)
                setSelectedCategory(null)
                setActiveTab("form")
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          )}
        </div>

        <TabsContent value="list" className="mt-0">
          <CategoryList categories={categories} onEdit={handleEditCategory} onToggleStatus={handleToggleStatus} />
        </TabsContent>

        <TabsContent value="form" className="mt-0">
          <CategoryForm
            category={selectedCategory}
            isEditing={isEditing}
            onSubmit={isEditing ? handleUpdateCategory : handleAddCategory}
            onCancel={handleCancelEdit}
          />
        </TabsContent>
      </Tabs>
    </Card>
  )
}

