import * as Yup from "yup";

export const validLocations = new Set([
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Pune",
  "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam",
  "Patna", "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut",
  "Rajkot", "Kalyan", "Vasai-Virar", "Varanasi", "Srinagar", "Aurangabad", "Dhanbad",
  "Amritsar", "Navi Mumbai", "Allahabad", "Ranchi", "Howrah", "Coimbatore", "Jabalpur",
  "Gwalior", "Vijayawada", "Jodhpur", "Madurai", "Raipur", "Kota", "Guwahati", "Chandigarh",
  "Solapur", "Hubli-Dharwad", "Mysore", "Tiruchirappalli", "Bareilly", "Aligarh",
  "Tiruppur", "Moradabad", "Jalandhar", "Bhubaneswar", "Salem", "Warangal", "Guntur",
  "Bikaner", "Noida", "Mangalore", "Belgaum", "Jamshedpur", "Bhilai", "Cuttack",
  "Firozabad", "Kochi", "Bhavnagar", "Dehradun", "Durgapur", "Asansol", "Nanded",
  "Kolhapur", "Ajmer", "Gandhinagar", "Ujjain", "Siliguri", "Jhansi", "Ulhasnagar",
  "Jammu", "Sangli", "Erode", "Malegaon", "Gaya", "Tirunelveli", "Ambattur",
  "Tirupati", "Bijapur", "Rampur", "Shimla", "Gangtok", "Aizawl", "Imphal", "Shillong",
  "Itanagar", "Agartala", "Panaji", "Port Blair", "Kavaratti",
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep", "Delhi", "Puducherry", "Ladakh", "Jammu and Kashmir"
])

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const SUPPORTED_IMAGE_FORMATS = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const SUPPORTED_DOCUMENT_FORMATS = [...SUPPORTED_IMAGE_FORMATS, "application/pdf"];

export const clientProfileSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email address"),
  phoneNumber: Yup.string().matches(
    /^(\+\d{1,3}[- ]?)?\d{10}$/,
    "Phone number must be 10 digits"
  ),
  location: Yup.object().shape({
    address: Yup.string().optional().required("Location address is required"),
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
