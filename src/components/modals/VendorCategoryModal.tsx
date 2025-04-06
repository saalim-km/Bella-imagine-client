import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CategoryType } from "@/hooks/admin/useAllCategory";
import { Spinner } from "../ui/spinner";
import { Input } from "@/components/ui/input";
import { useAllVendorCategoryQuery } from "@/hooks/vendor/useVendor";

interface VendorCategoryModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSave?: (category: string) => void;
}

export function VendorCategoryModal({
  isOpen,
  onClose,
  onSave,
}: VendorCategoryModalProps) {
  const [categories, setCategories] = useState<CategoryType[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [newCategory, setNewCategory] = useState<string>("");
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);

  const { data, isLoading } = useAllVendorCategoryQuery();

  useEffect(() => {
    if (data) {
      setCategories(data.categories);
    }
  }, [data]);

  // Handles category selection or creation
  const handleCategoryChange = (value: string) => {
    if (isCreatingNew) {
      setNewCategory(value);
    } else {
      setSelectedCategory(value);
    }
  };

  const handleSave = () => {
    if (isCreatingNew && newCategory) {
      console.log("Creating new category:", newCategory);
      onSave?.(newCategory);
    } else if (!isCreatingNew && selectedCategory) {
      console.log("Selected category:", selectedCategory);
      onSave?.(selectedCategory);
    }
    onClose?.();
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (!categories) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Choose a Category</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isCreatingNew ? (
            <Input
              onChange={(e) => handleCategoryChange(e.target.value)}
              value={newCategory}
              placeholder="Enter new category name"
              className="w-full"
            />
          ) : (
            <Select onValueChange={handleCategoryChange} value={selectedCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category._id} value={category._id}>
                    {category.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
          variant={"outline"}
            onClick={handleSave}
            disabled={isCreatingNew ? !newCategory : !selectedCategory}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
