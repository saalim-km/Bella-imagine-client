import { AxiosError } from "axios";
import { showErrorToast } from "../toast/customToast";


export const handleError = (error: unknown) => {
    if(error instanceof AxiosError) {
        if(error.response) {
            console.log("Response error:", error.response.data.message);
            showErrorToast(error.response.data.message);
        }else if(error.request) {
            console.log("Network error:", error.message);
            showErrorToast("Network error. Please try again.");
        }else {
            console.log("Error setting up request:", error.message);
            showErrorToast("An error occurred while setting up the request.");
        }
    }else {
        console.log("An unexpected error occurred:", error);
        showErrorToast("An unexpected error occurred.");
    }
};