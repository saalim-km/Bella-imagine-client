import * as Yup from "yup";

const validLocations = new Set([
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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DOCUMENTS = 2;

const SUPPORTED_IMAGE_FORMATS = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const SUPPORTED_DOCUMENT_FORMATS = [...SUPPORTED_IMAGE_FORMATS, "application/pdf"];

export const clientProfileSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email address"),
  phoneNumber: Yup.string().matches(
    /^(\+\d{1,3}[- ]?)?\d{10}$/,
    "Phone number must be 10 digits"
  ),
  location: Yup.string()
  .test(
    "isValidLocation",
    "Location must be a valid location in India",
    (value) => {
      return !value || validLocations.has(value);
    }
  ),
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
  location: Yup.string()
    .test(
      "isValidLocation",
      "Location must be a valid location in India",
      (value) => {
        return !value || validLocations.has(value);
      }
    ),
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
      "maxFiles",
      `Maximum ${MAX_DOCUMENTS} documents allowed`,
      (value) => !value || value.length <= MAX_DOCUMENTS
    )
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
