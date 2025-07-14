import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useUpdateCategory,
  useAllCategoryMutation,
} from "@/hooks/admin/useAllCategory";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { AxiosResponse } from "@/hooks/auth/useOtpVerify";
import { handleError } from "@/utils/Error/error-handler.utils";
import { useQueryClient } from "@tanstack/react-query";
import { CategoryFormProps } from "@/types/component-types/admin-component.types";
import { communityToast } from "@/components/ui/community-toast";
import { Category } from "@/services/categories/categoryService";

const CategorySchema = Yup.object().shape({
  title: Yup.string().trim().required("Category title is required"),
  status: Yup.string().oneOf(["active", "inactive"], "Invalid status"),
});

export function CategoryForm({ initialData, onClose , filterOptions,pagination}: CategoryFormProps) {
  const queryClient = useQueryClient();

  // Separate mutation hooks for adding and updating categories
  const { mutate: addCategory } = useAllCategoryMutation();
  const { mutate: updateCategoryMutate } = useUpdateCategory();

  return (
    <div className="p-4 border rounded-lg shadow-md ">
      <h3 className="text-lg font-semibold mb-4">
        {initialData ? "Edit Category" : "Add Category"}
      </h3>
      <Formik
        initialValues={{
          title: initialData?.title || "",
          status: initialData?.status ? "active" : "inactive",
        }}
        validationSchema={CategorySchema}
        onSubmit={(values) => {
          const isActive = values.status === "active";

          if (initialData) {

            const queryKey = ["category-list-admin",filterOptions,pagination]
            const prevData = queryClient.getQueryData(queryKey)

            queryClient.setQueryData(queryKey,(oldData : any)=> {
              if(!oldData) return oldData;

              const updatedDoc = oldData.data.data.map((cat : Category)=> {
                return cat._id == initialData._id ? {...cat,title : values.title,status : isActive} : cat
              })

              return {
                ...oldData,
                data : {
                  ...oldData.data,
                  data : updatedDoc
                }
              }
            })
            updateCategoryMutate(
              {
                id: initialData._id,
                data: {
                  title: values.title,
                  status: isActive,
                },
              },
              {
                onSuccess: (data) => {
                  communityToast.success({ description: data?.message });
                  onClose();
                },
                onError: (err) => {
                  queryClient.setQueryData(queryKey,prevData)
                  handleError(err);
                },
              }
            );
          } else {
            addCategory(
              { title: values.title, status: isActive },
              {
                onSuccess: (data) => {
                  queryClient.invalidateQueries({queryKey : ['category-list-admin']})
                  const response = data as AxiosResponse;
                  communityToast.success({ description: response?.message });
                  onClose();
                },
                onError: (err) => {
                  handleError(err);
                },
              }
            );
          }
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <div className="mb-4">
              <Label htmlFor="title">Category Title</Label>
              <Field id="title" name="title" as={Input} className="w-full" />
              {errors.title && touched.title && (
                <div className="text-red-500 text-sm">{errors.title}</div>
              )}
            </div>

            <div className="mb-4">
              <Label htmlFor="status">Status</Label>
              <Field
                as="select"
                name="status"
                className="border p-2 rounded w-full bg-background"
              >
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
