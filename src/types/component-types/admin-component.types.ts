import { CategoryType } from "@/hooks/admin/useAllCategory";

export interface CategoryFormProps {
  initialData?: CategoryType | null;
  onClose: () => void;
}