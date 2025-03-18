import { useState } from "react"
import { Edit, Search } from "lucide-react"
import type { Category } from "./category"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface CategoryListProps {
  categories: Category[]
  onEdit: (category: Category) => void
  onToggleStatus: (id: string) => void
}

export function CategoryList({ categories, onEdit, onToggleStatus }: CategoryListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filter categories based on search term and status filter
  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())

    if (statusFilter === "all") return matchesSearch
    if (statusFilter === "active") return matchesSearch && category.isActive
    if (statusFilter === "inactive") return matchesSearch && !category.isActive

    return matchesSearch
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="active">Active Only</SelectItem>
            <SelectItem value="inactive">Inactive Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredCategories.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          No categories found. Try adjusting your search or filters.
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>
                    <Badge variant={category.isActive ? "default" : "secondary"}>
                      {category.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{category.updatedAt.toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => onEdit(category)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <div className="flex items-center gap-2">
                            <Switch id={`status-${category.id}`} checked={category.isActive} />
                          </div>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {category.isActive ? "Deactivate" : "Activate"} Category?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {category.isActive
                                ? "Deactivating this category will hide it from new vendors. Existing vendors using this category will not be affected."
                                : "Activating this category will make it available for all vendors to select."}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onToggleStatus(category.id)}>
                              {category.isActive ? "Deactivate" : "Activate"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

