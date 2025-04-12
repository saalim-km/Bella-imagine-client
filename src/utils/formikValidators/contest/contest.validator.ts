import * as Yup from "yup";

export const contestValidationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  description: Yup.string()
    .trim()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  contestType: Yup.string()
    .oneOf(["weekly", "monthly", "yearly"], "Invalid contest type")
    .required("Contest type is required"),
  categoryId: Yup.string()
    .required("Category is required"), 
  startDate: Yup.date()
    .required("Start date is required")
    .typeError("Invalid start date"),
  endDate: Yup.date()
    .required("End date is required")
    .typeError("Invalid end date")
    .min(Yup.ref("startDate"), "End date must be after start date"),
  featured: Yup.boolean(),
});