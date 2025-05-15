import axios from "axios"
import { handleError } from "../Error/error-handler.utils";

export async function getLocationFromCordinates(latitude : number, longitude : number) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`

    try {
        const response = await fetch(url);
        const data = await response.json()
        console.log(data);
    } catch (error) {
        handleError(error)
    }
}