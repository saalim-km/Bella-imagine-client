import * as Yup from "yup"
export const passwordSchema = Yup.object({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[^A-Za-z0-9]/, "Password must contain at least one special character")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
})


export const passwordRequirements = [
    { id: "length", label: "At least 8 characters", regex: /.{8,}/ },
    { id: "uppercase", label: "At least one uppercase letter", regex: /[A-Z]/ },
    { id: "lowercase", label: "At least one lowercase letter", regex: /[a-z]/ },
    { id: "number", label: "At least one number", regex: /[0-9]/ },
    { id: "special", label: "At least one special character", regex: /[^A-Za-z0-9]/ },
]