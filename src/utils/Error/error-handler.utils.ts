import { AxiosError } from "axios";
import { toast } from "sonner";


export const handleError = (error: unknown) => {
    if(error instanceof AxiosError) {
        if(error.response) {
            console.log("Response error:", error.response.data.message);
            toast.error(error.response.data.message);
            
        }else if(error.request) {
            console.log("Network error:", error.message);
            toast.error("Network error. Please try again.");
        }else {
            console.log("Error setting up request:", error.message);
            toast.error("An error occurred while setting up the request.");
        }
    }else {
        console.log("An unexpected error occurred:", error);
        toast.error("An unexpected error occurred.");
    }
};