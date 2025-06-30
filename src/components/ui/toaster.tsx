"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  Camera,
} from "lucide-react";

const iconMap = {
  default: Camera,
  success: CheckCircle,
  destructive: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(
        ({ id, title, description, action, variant = "default", ...props }) => {
          type Variant = keyof typeof iconMap;
          const safeVariant: Variant = (
            variant && iconMap.hasOwnProperty(variant) ? variant : "default"
          ) as Variant;
          const Icon = iconMap[safeVariant];

          return (
            <Toast key={id} variant={variant} {...props}>
              <div className="flex items-start gap-3 w-full">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    variant === "success"
                      ? "bg-green-100"
                      : variant === "destructive"
                      ? "bg-red-100"
                      : variant === "warning"
                      ? "bg-yellow-100"
                      : variant === "info"
                      ? "bg-blue-100"
                      : "bg-orange-100"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      variant === "success"
                        ? "text-green-600"
                        : variant === "destructive"
                        ? "text-red-600"
                        : variant === "warning"
                        ? "text-yellow-600"
                        : variant === "info"
                        ? "text-blue-600"
                        : "text-orange-600"
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  {title && <ToastTitle>{title}</ToastTitle>}
                  {description && (
                    <ToastDescription>{description}</ToastDescription>
                  )}
                </div>
                {action}
              </div>
              <ToastClose />
            </Toast>
          );
        }
      )}
      <ToastViewport />
    </ToastProvider>
  );
}
