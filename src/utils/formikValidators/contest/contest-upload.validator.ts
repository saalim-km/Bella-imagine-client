import * as Yup from "yup";

export const contestValidationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .required("Title is required")
    .max(100, "Title must be 100 characters or less"),
  caption: Yup.string()
    .trim()
    .max(500, "Caption must be 500 characters or less")
    .nullable(),
  imageFile: Yup.mixed()
    .required("Please upload an image")
    .test("fileSize", "Image must be smaller than 10MB", (value) => {
      return value && (value as File).size <= 10 * 1024 * 1024;
    })
    .test("fileType", "Only JPG, PNG, or GIF files are allowed", (value) => {
      return (
        value &&
        ["image/jpeg", "image/png", "image/gif"].includes((value as File).type)
      );
    }),
  category: Yup.string()
    .required("Category is required"),
  contest: Yup.string()
    .required("Contest is required")
});