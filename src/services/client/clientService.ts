import { clientAxiosInstance } from "@/api/client.axios";
import { ENDPOINTS } from "@/api/endpoints";
import { IClientReponse, IProfileUpdate, IProfileUpdateResponse } from "@/types/User";
import { data } from "react-router-dom";

export interface IClient {
    _id ?: string;
    name : string;
    email : string;
    profileImage ?: string;
    password ?: string;
    phoneNumber ?: number;
    location ?: string;
    googleId ?: string;
    role : "client";
    savedPhotographers ?: string[];
    savedPhotos ?: string[];
    isActive ?: boolean;
    isblocked : boolean;
    createdAt : Date;
    updatedAt : Date;
}



export const getClientDetails = async (): Promise<IClientReponse>  => {
    const response = await clientAxiosInstance.get(ENDPOINTS.CLIENT_DETAILS);
    return response.data;
};

export const updateClientDetails = async(data : IProfileUpdate): Promise<IProfileUpdateResponse> => {
    const response = await clientAxiosInstance.put(ENDPOINTS.CLIENT_DETAILS , data);
    return response.data;
}