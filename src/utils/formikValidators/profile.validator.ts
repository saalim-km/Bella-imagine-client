import * as Yup from "yup";

// Client Profile Validation Schema
export const clientProfileSchema = Yup.object({
  name: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, "Name should only contain letters and spaces")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phoneNumber: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .required("Phone number is required"),
  location: Yup.string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location must not exceed 100 characters")
    .required("Location is required"),
});

// Vendor Profile Validation Schema
export const vendorProfileSchema = Yup.object({
  name: Yup.string()
    .matches(/^[a-zA-Z\s]+$/, "Name should only contain letters and spaces")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .required("Name is required"),
  location: Yup.string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location must not exceed 100 characters")
    .required("Location is required"),
  profileDescription: Yup.string()
    .min(10, "Profile description must be at least 10 characters")
    .max(500, "Profile description must not exceed 500 characters")
    .required("Profile description is required"),
  phoneNumber: Yup.string()
    .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone number")
    .required("Phone number is required"),
  portfolioWebsite: Yup.string()
    .url("Invalid website URL")
    .required("Portfolio website is required"),
  languages: Yup.array()
    .of(Yup.string().min(2, "Language must be at least 2 characters"))
    .required("At least one language is required"),
});
