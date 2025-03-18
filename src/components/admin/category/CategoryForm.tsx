import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { Category } from './category'
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Category name must be at least 2 characters.",
    })
    .max(50, {
      message: "Category name must not exceed 50 characters.",
    })
    .max(500, {
      message: "Description must not exceed 500 characters.",
    }),
  isActive: z.boolean().default(true),
})

type FormValues = z.infer<typeof formSchema>

interface CategoryFormProps {
  category: Category | null
  isEditing: boolean
  onSubmit: (values: any) => void
  onCancel: () => void
}

export function CategoryForm({ category, isEditing, onSubmit, onCancel }: CategoryFormProps) {
  // Initialize the form with default values or existing category values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name || "",
      isActive: category?.isActive ?? true,
    },
  })

  // Handle form submission
  const handleSubmit = (values: FormValues) => {
    if (isEditing && category) {
      onSubmit({
        ...category,
        ...values,
      })
    } else {
      onSubmit(values)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Wedding Photography" {...field} />
              </FormControl>
              <FormDescription>The name of the photography category as it will appear to vendors.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what this category encompasses..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A detailed description of the category to help vendors understand what services fall under it.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active Status</FormLabel>
                <FormDescription>
                  {field.value
                    ? "This category is active and visible to vendors."
                    : "This category is inactive and hidden from new vendors."}
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">{isEditing ? "Update Category" : "Add Category"}</Button>
        </div>
      </form>
    </Form>
  )
}

