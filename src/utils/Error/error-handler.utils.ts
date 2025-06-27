import { communityToast } from "@/components/ui/community-toast";
import { AxiosError } from "axios";

export const handleError = (error: unknown) => {
  if (error instanceof AxiosError) {
    if (error.response) {
      const data = error.response.data;

      // Handle Zod-style validation errors
      if (data && Array.isArray(data.errors)) {
        data.errors.forEach((err: any) => {
          const path = Array.isArray(err.path) ? ` (${err.path.join(" > ")})` : "";
          communityToast.error({title : `${err.message}${path}`});
        });
      } else if (data && data.message) {
        // Generic backend message
        communityToast.error({title : data.message});
      } else {
        communityToast.error({title : "Something went wrong. Please try again."});
      }

    } else if (error.request) {
      console.error("Network error:", error.message);
      communityToast.error({title : "Network error. Please check your connection."});
    } else {
      console.error("Axios setup error:", error.message);
      communityToast.error({title : "An error occurred while preparing the request."});
    }

  } else {
    console.error("Unknown error:", error);
    communityToast.error({title : "An unexpected error occurred."});
  }
};
