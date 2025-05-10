import axios from "axios";

export const chatAxionInstance = axios.create({
    baseURL : import.meta.env.VITE_CHAT_API_URL,
    withCredentials : true
})