import { toast } from "sonner";

export const showSuccessToast = (message: string) => {
  toast.success(message, { duration: 3000 });
};

export const showErrorToast = (message: string) => {
  toast.error(message, { duration: 3000 });
};

export const showWarningToast = (message: string) => {
  toast(message, {
    duration: 3000,
    icon: "⚠️",
    style: { background: "#FFA500", color: "#fff" },
  });
};

export const showInfoToast = (message: string) => {
  toast(message, {
    duration: 3000,
    icon: "ℹ️",
    style: { background: "#007BFF", color: "#fff" },
  });
};
