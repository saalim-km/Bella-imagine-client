import * as Yup from "yup";

export const signupSchema = Yup.object().shape({
  name: Yup.string()
    .min(6, "Name must be at least 6 characters long")
    .matches(
      /^(?!\s+$)[A-Za-z\s]+$/,
      "Name can only contain letters and spaces (not only spaces)"
    )
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|org|net|edu|gov)$/,
      "Email must end with .com, .in, .org, etc."
    )
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Must include a lowercase letter")
    .matches(/[A-Z]/, "Must include an uppercase letter")
    .matches(/[0-9]/, "Must include a number")
    .matches(/[\W_]/, "Must include a special character")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), ""], "Passwords must match")
    .required("Confirm password is required"),
});
