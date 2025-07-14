import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { Eye, EyeOff, Loader2, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { TRole } from "@/types/interfaces/User";
import {
  passwordRequirements,
  passwordSchema,
} from "@/utils/formikValidators/auth/reset-password.vlidator";
import { useResetPasswordMUtation } from "@/hooks/auth/useResetPassword";
import { handleError } from "@/utils/Error/error-handler.utils";
import { useNavigate } from "react-router-dom";
import { communityToast } from "../ui/community-toast";

// Password strength requirements

interface FormValues {
  password: string;
  confirmPassword: string;
}

interface NewPasswordFormProps {
  onComplete: () => void;
  email: string;
  userType: TRole;
}

export function NewPasswordForm({ email, userType }: NewPasswordFormProps) {
  const navigate = useNavigate();
  const { mutate: resetPassword } = useResetPasswordMUtation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const calculatePasswordStrength = (password: string) => {
    if (!password) return 0;

    let strength = 0;
    passwordRequirements.forEach((requirement) => {
      if (requirement.regex.test(password)) {
        strength += 20;
      }
    });

    return strength;
  };

  const handleSubmit = (
    values: FormValues,
    { setSubmitting }: FormikHelpers<FormValues>
  ) => {
    console.log(setSubmitting);
    setIsSubmitting(true);
    resetPassword(
      { email: email, role: userType, password: values.password },
      {
        onSuccess: (data) => {
          communityToast.success({ description: data?.message });

          if (userType === "vendor") {
            navigate("/vendor/login");
          } else {
            navigate("/login");
          }
        },
        onError: (err) => {
          handleError(err);
        },
      }
    );
  };

  const getStrengthColor = () => {
    if (passwordStrength < 40) return "bg-destructive";
    if (passwordStrength < 80) return "bg-amber-500";
    return "bg-green-500";
  };
  const getStrengthLabel = () => {
    if (passwordStrength < 40) return "Weak";
    if (passwordStrength < 80) return "Medium";
    return "Strong";
  };

  return (
    <Formik
      initialValues={{
        password: "",
        confirmPassword: "",
      }}
      validationSchema={passwordSchema}
      onSubmit={handleSubmit}
    >
      {({ values, handleChange }) => (
        <Form className="space-y-4 py-2">
          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium">
              New Password
            </label>
            <div className="relative">
              <Field
                as={Input}
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleChange(e);
                  setPasswordStrength(
                    calculatePasswordStrength(e.target.value)
                  );
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
            <ErrorMessage name="password">
              {(msg) => <div className="text-sm text-destructive">{msg}</div>}
            </ErrorMessage>

            <div className="space-y-2 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Password strength:
                </span>
                <span
                  className={`text-sm font-medium ${
                    passwordStrength < 40
                      ? "text-destructive"
                      : passwordStrength < 80
                      ? "text-amber-500"
                      : "text-green-500"
                  }`}
                >
                  {getStrengthLabel()}
                </span>
              </div>
              <Progress
                value={passwordStrength}
                className={getStrengthColor()}
              />
            </div>

            <div className="mt-2">
              <p className="text-xs text-muted-foreground mb-1">
                Password requirements:
              </p>
              <ul className="text-xs space-y-1">
                {passwordRequirements.map((req) => (
                  <li
                    key={req.id}
                    className={`flex items-center ${
                      values.password && req.regex.test(values.password)
                        ? "text-green-500"
                        : "text-muted-foreground"
                    }`}
                  >
                    {values.password && req.regex.test(values.password) ? (
                      <Check className="h-3 w-3 mr-1" />
                    ) : (
                      <span className="h-3 w-3 mr-1">•</span>
                    )}
                    {req.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </label>
            <div className="relative">
              <Field
                as={Input}
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="sr-only">
                  {showConfirmPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
            <ErrorMessage name="confirmPassword">
              {(msg) => <div className="text-sm text-destructive">{msg}</div>}
            </ErrorMessage>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting Password
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
