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
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data, isLoading } = useAllVendorCategoryQuery();

  useEffect(() => {
    if (data) {
      setCategories(data.data.data);
    }
  }, [data]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleSave = () => {
    if (selectedCategory) {
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handleSave}
            disabled={!selectedCategory}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}