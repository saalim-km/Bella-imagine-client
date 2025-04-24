import axios from "axios";

export const chatAxiosInstance = axios.create({
    baseURL : import.meta.env.VITE_CHAT_API_URL,
})