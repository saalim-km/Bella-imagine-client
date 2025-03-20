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
import { PlusCircle } from "lucide-react";
import { useAllVendorCategoryQuery, useJoinCategoryRequestMutation } from "@/hooks/vendor/useVendor";


interface VendorCategoryModalProps {
  isOpen: boolean;
  onClose ?: () => void;
  onSave ?: (category: string) => void;
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

  const { data, isLoading } = useAllVendorCategoryQuery()
  console.log('categories : ',data);
  useEffect(() => {
    if (data) {
      setCategories(data.categories);
    }
  }, [data]);

  const handleSave = () => {
    console.log(selectedCategory);
    onSave?.(selectedCategory);
    onClose?.();
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (!categories) {
    return;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Choose or Create Category</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* {!isCreatingNew ? ( */}
          <Select onValueChange={setSelectedCategory} value={selectedCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.categoryId} value={category._id}>
                  {category.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
            <Input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCategory(e.target.value)}
            value={newCategory}
            placeholder="Enter new category name"
            className="w-full"
            />
            <Button
            variant="outline"
            className="w-full"
            onClick={() => console.log('creatin new category')}
            >
            <PlusCircle className="mr-2 h-4 w-4" />
            {isCreatingNew ? "Choose Existing Category" : "Create New Category"}
            </Button>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!selectedCategory}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
