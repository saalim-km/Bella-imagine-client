import * as Yup from "yup";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const SUPPORTED_IMAGE_FORMATS = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const SUPPORTED_DOCUMENT_FORMATS = [...SUPPORTED_IMAGE_FORMATS, "application/pdf"];

export const clientProfileSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email address"),
  phoneNumber: Yup.string().matches(
    /^(\+\d{1,3}[- ]?)?\d{10}$/,
    "Phone number must be 10 digits"
  ),
  location: Yup.string(),
  profileImage: Yup.string(),
  imageFile: Yup.mixed()
    .nullable()
    .test(
      "fileSize",
      "File size is too large (max 5MB)",
      (value) => !value || value.size <= MAX_FILE_SIZE
    )
    .test(
      "fileFormat",
      "Unsupported file format",
      (value) => !value || SUPPORTED_IMAGE_FORMATS.includes(value.type)
    ),
});

export const vendorProfileSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  phoneNumber: Yup.string().matches(
    /^(\+\d{1,3}[- ]?)?\d{10}$/,
    "Phone number must be 10 digits"
  ),
  location: Yup.string(),
  profileDescription: Yup.string(),
  profileImage: Yup.string(),
  portfolioWebsite: Yup.string().url("Invalid URL"),
  languages: Yup.array().of(Yup.string()),
  imageFile: Yup.mixed()
    .nullable()
    .test(
      "fileSize",
      "File size is too large (max 5MB)",
      (value) => !value || value.size <= MAX_FILE_SIZE
    )
    .test(
      "fileFormat",
      "Unsupported file format",
      (value) => !value || SUPPORTED_IMAGE_FORMATS.includes(value.type)
    ),
  verificationDocuments: Yup.array()
    .nullable()
    .test(
      "fileSize",
      "One or more files are too large (max 5MB each)",
      (value) => !value || value.every(file => file.size <= MAX_FILE_SIZE)
    )
    .test(
      "fileFormat",
      "Unsupported file format. Only PDF, PNG, JPG, and JPEG are allowed",
      (value) => !value || value.every(file => SUPPORTED_DOCUMENT_FORMATS.includes(file.type))
    ),
});
