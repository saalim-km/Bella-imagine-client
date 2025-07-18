// Fixed production version of VendorCategoryModal.tsx
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
import { Spinner } from "../ui/spinner";
import { useAllVendorCategoryQuery } from "@/hooks/vendor/useVendor";
import { Category } from "@/services/categories/categoryService";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface VendorCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (category: string) => void;
}

export function VendorCategoryModal({
  isOpen,
  onClose,
  onSave,
}: VendorCategoryModalProps) {
  const user = useSelector((state: RootState) => state.vendor.vendor);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data, isLoading, error } = useAllVendorCategoryQuery(
    user?.role === "vendor"
  );

  useEffect(() => {
    if (data) {
      setCategories(data.data.data);
    }
  }, [data]);

  useEffect(() => {
    if (isOpen) {
      setSelectedCategory("");
    }
  }, [isOpen]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleSave = () => {
    if (selectedCategory) {
      onSave(selectedCategory);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  // Always render the Dialog when isOpen is true
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Choose a Category</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Spinner />
            </div>
          ) : error ? (
            <div className="text-center p-4">
              <p className="text-red-500">
                Error loading categories. Please try again.
              </p>
            </div>
          ) : !categories || categories.length === 0 ? (
            <div className="text-center p-4">
              <p>No categories available.</p>
            </div>
          ) : (
            <Select
              onValueChange={handleCategoryChange}
              value={selectedCategory}
            >
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
            onClick={handleSave}
            disabled={!selectedCategory || isLoading}
            className="bg-orange-700 hover:bg-orange-800"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
