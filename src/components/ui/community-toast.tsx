"use client";
import { toast as baseToast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";

interface CommunityToastOptions {
  title?: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Community-themed toast variants
export const communityToast = {
  // Success variants
  success: (options: CommunityToastOptions) => {
    return baseToast({
      variant: "success",
      title: options.title || "Success!",
      description: options.description,
      duration: options.duration,
      action: options.action ? (
        <ToastAction
          altText={options.action.label}
          onClick={options.action.onClick}
        >
          {options.action.label}
        </ToastAction>
      ) : undefined,
    });
  },

  // Photography-specific success messages
  photoUploaded: (count = 1) => {
    return baseToast({
      variant: "success",
      title: "Photos uploaded successfully!",
      description: `${count} ${
        count === 1 ? "photo" : "photos"
      } added to your portfolio`,
    });
  },

  bookingConfirmed: (photographerName?: string) => {
    return baseToast({
      variant: "success",
      title: "Booking confirmed!",
      description: photographerName
        ? `Your session with ${photographerName} has been confirmed`
        : "Your photography session has been confirmed",
    });
  },

  bookingSchedules: (photographerName : string) => {
    return baseToast({
      variant: "success",
      title: "Booking confirmed!",
      description: photographerName
        ? `Your session with ${photographerName} has been Scheduled`
        : "Your photography session has been confirmed",
    });
  },

  profileUpdated: () => {
    return baseToast({
      variant: "success",
      title: "Profile updated!",
      description: "Your changes have been saved successfully",
    });
  },

  // Error variants
  error: (options: CommunityToastOptions) => {
    return baseToast({
      variant: "destructive",
      title: options.title || "Something went wrong",
      description: options.description,
      duration: options.duration,
    });
  },

  uploadFailed: () => {
    return baseToast({
      variant: "destructive",
      title: "Upload failed",
      description: "Please check your file size and format, then try again",
    });
  },

  bookingFailed: () => {
    return baseToast({
      variant: "destructive",
      title: "Booking failed",
      description: "Unable to process your booking. Please try again",
    });
  },

  // Warning variants
  warning: (options: CommunityToastOptions) => {
    return baseToast({
      variant: "warning",
      title: options.title || "Warning",
      description: options.description,
      duration: options.duration,
    });
  },

  profileIncomplete: () => {
    return baseToast({
      variant: "warning",
      title: "Complete your profile",
      description: "Add more details to attract more clients",
      action: (
        <ToastAction
          altText="Complete profile"
          onClick={() => (window.location.href = "/profile")}
        >
          Complete now
        </ToastAction>
      ),
    });
  },

  // Info variants
  info: (options: CommunityToastOptions) => {
    return baseToast({
      variant: "info",
      title: options.title || "Info",
      description: options.description,
      duration: 1500,
    });
  },

  newMessage: (message: string) => {
    return baseToast({
      variant: "info",
      title: "New message",
      description: `${message}`,
    });
  },

  // Community-specific toasts
  welcomePhotographer: (name: string) => {
    return baseToast({
      variant: "default",
      title: `Welcome back to community, ${name}!`,
      description: "Start building your portfolio and connecting with clients",
      duration: 6000,
    });
  },

  welcomeClient: (name: string) => {
    return baseToast({
      variant: "default",
      title: `Welcome back to community, ${name}!`,
      description: "Discover amazing photographers in your area",
      duration: 6000,
    });
  },

  portfolioLiked: (likerName: string) => {
    return baseToast({
      variant: "info",
      title: "Someone liked your work!",
      description: `${likerName} liked your portfolio`,
    });
  },

  reviewReceived: (rating: number) => {
    return baseToast({
      variant: "success",
      title: "New review received!",
      description: `You received a ${rating}-star review`,
    });
  },

  // Loading states
  uploading: () => {
    return baseToast({
      variant: "info",
      title: "Uploading photos...",
      description: "Please wait while we process your images",
      duration: 10000,
    });
  },

  processing: (action: string) => {
    return baseToast({
      variant: "info",
      title: `${action}...`,
      description: "This may take a few moments",
      duration: 8000,
    });
  },

  logout: () => {
    return baseToast({
      variant: "info",
      title: "Logged out",
      description: "You have been successfully logged out.",
      duration: 4000,
    });
  },

  registerSuccess: (name?: string) => {
    return baseToast({
      variant: "success",
      title: "Registration successful!",
      description: name
        ? `Welcome aboard, ${name}! Your account has been created.`
        : "Your account has been created successfully.",
      duration: 5000,
    });
  },
};

// Quick access functions for common use cases
export const showSuccess = (message: string, title?: string) => {
  return communityToast.success({ title, description: message });
};

export const showError = (message: string, title?: string) => {
  return communityToast.error({ title, description: message });
};

export const showWarning = (message: string, title?: string) => {
  return communityToast.warning({ title, description: message });
};

export const showInfo = (message: string, title?: string) => {
  return communityToast.info({ title, description: message });
};
