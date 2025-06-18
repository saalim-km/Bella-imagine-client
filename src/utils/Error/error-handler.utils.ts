import { AxiosError } from "axios";
import { toast } from "sonner";

export const handleError = (error: unknown) => {
  if (error instanceof AxiosError) {
    if (error.response) {
      const data = error.response.data;

      // Handle Zod-style validation errors
      if (data && Array.isArray(data.errors)) {
        data.errors.forEach((err: any) => {
          const path = Array.isArray(err.path) ? ` (${err.path.join(" > ")})` : "";
          toast.error(`${err.message}${path}`);
        });
      } else if (data && data.message) {
        // Generic backend message
        toast.error(data.message);
      } else {
        toast.error("Something went wrong. Please try again.");
      }

    } else if (error.request) {
      console.error("Network error:", error.message);
      toast.error("Network error. Please check your connection.");
    } else {
      console.error("Axios setup error:", error.message);
      toast.error("An error occurred while preparing the request.");
    }

  } else {
    console.error("Unknown error:", error);
    toast.error("An unexpected error occurred.");
  }
};
