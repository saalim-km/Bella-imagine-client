import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { categoryKeys, CategoryType, useAllCategoryMutation, useUpdateCategoryMutation } from "@/hooks/admin/useAllCategory";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { AxiosResponse } from "@/hooks/auth/useOtpVerify";
import { handleError } from "@/utils/Error/errorHandler";
import { useQueryClient } from "@tanstack/react-query";

interface CategoryFormProps {
  initialData?: CategoryType | null;
  onClose: () => void;
}

const CategorySchema = Yup.object().shape({
  title: Yup.string().trim().required("Category title is required"),
  status: Yup.string().oneOf(["active", "inactive"], "Invalid status"),
});

export function CategoryForm({ initialData, onClose }: CategoryFormProps) {
    const queryClient = useQueryClient()
  const { mutate: addCategory } = useUpdateCategoryMutation();

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h3 className="text-lg font-semibold mb-4">
        {initialData ? "Edit Category" : "Add Category"}
      </h3>
      <Formik
        initialValues={{
          title: initialData?.title || "",
          status: initialData?.status || "active",
        }}
        validationSchema={CategorySchema}
        onSubmit={(values) => {
          console.log({ title: values.title, status: values.status === "active" });
          const isActive = values.status === "active"
          addCategory({title : values.title , status : isActive},{
            onSuccess : (data)=> {
                const response = data as AxiosResponse;
                toast.success(response.message);
                queryClient.invalidateQueries({queryKey : categoryKeys.lists()})
                onClose();
            },
            onError : (err)=> {
                handleError(err)
            }
          })
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <div className="mb-4">
              <Label htmlFor="title">Category Title</Label>
              <Field
                id="title"
                name="title"
                as={Input}
                className="w-full"
              />
              {errors.title && touched.title && (
                <div className="text-red-500 text-sm">{errors.title}</div>
              )}
            </div>

            <div className="mb-4">
              <Label htmlFor="status">Status</Label>
              <Field as="select" name="status" className="border p-2 rounded w-full">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Field>
              {errors.status && touched.status && (
                <div className="text-red-500 text-sm">{errors.status}</div>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">{initialData ? "Update" : "Add"}</Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}
