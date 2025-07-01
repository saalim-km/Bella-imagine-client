import * as Yup from "yup";


const MAX_FILE_SIZE = 5 * 1024 * 1024;

const SUPPORTED_IMAGE_FORMATS = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const SUPPORTED_DOCUMENT_FORMATS = [...SUPPORTED_IMAGE_FORMATS, "application/pdf"];

export const clientProfileSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email address"),
  phoneNumber: Yup.string()
    .matches(
      /^(\+91[\-\s]?)?[6-9]\d{9}$/,
      "Phone number must be a valid Indian number"
    )
    .optional(),
  location: Yup.object().shape({
    address: Yup.string().optional().optional(),
    lat: Yup.number().optional().required("Latitude is required").min(-90).max(90),
    lng: Yup.number().optional().required("Longitude is required").min(-180).max(180),
  }),
  profileImage: Yup.string().optional(),
  imageFile: Yup.mixed()
    .nullable()
    .test(
      "fileSize",
      "File size is too large (max 5MB)",
      (value) => !value || (value instanceof File && value.size <= MAX_FILE_SIZE)
    )
    .test(
      "fileFormat",
      "Unsupported file format",
      (value : any) => !value || SUPPORTED_IMAGE_FORMATS.includes(value.type)
    ).optional()
});

export const vendorProfileSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  phoneNumber: Yup.string().matches(
    /^(\+\d{1,3}[- ]?)?\d{10}$/,
    "Phone number must be 10 digits"
  ),
location: Yup.object().shape({
    address: Yup.string().optional().required("Location address is required"),
    lat: Yup.number().optional().required("Latitude is required").min(-90).max(90),
    lng: Yup.number().optional().required("Longitude is required").min(-180).max(180),
  }),
  profileDescription: Yup.string(),
  profileImage: Yup.string(),
  portfolioWebsite: Yup.string().url("Invalid URL"),
  languages: Yup.array().of(Yup.string()),
  imageFile: Yup.mixed()
    .nullable()
    .test(
      "fileSize",
      "File size is too large (max 5MB)",
      (value : any) => !value || value.size <= MAX_FILE_SIZE
    )
    .test(
      "fileFormat",
      "Unsupported file format",
      (value : any) => !value || SUPPORTED_IMAGE_FORMATS.includes(value.type)
    ),
  verificationDocument: Yup.mixed()
    .nullable()
    .test(
      "fileSize",
      "File size is too large (max 5MB)",
      (value : any) => !value || value.size <= MAX_FILE_SIZE
    )
    .test(
      "fileFormat",
      "Unsupported file format. Only PDF, PNG, JPG, and JPEG are allowed",
      (value : any) => !value || SUPPORTED_DOCUMENT_FORMATS.includes(value.type)
    ),
});
