import { clientAxiosInstance } from "@/api/client.axios";

export interface IClient {
    _id : string;
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


export const getClientDetails = async ()  => {
    console.log('client service called');
    const response = await clientAxiosInstance.get('/client/details');
    return response.data;
};
  