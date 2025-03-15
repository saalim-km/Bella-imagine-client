import { IClient } from "@/services/client/clientService";
import { IVendor } from "@/services/vendor/vendorService";
export interface IUser {
  name: string;
  email: string;
  password: string;
  role: TRole;
}

export type TRole = "vendor" | "client" | "admin";

export interface ILogin {
  email: string;
  password: string;
  role: TRole;
}

export interface IClientReponse {
  success: boolean;
  client: IClient;
}

export interface IVendorReponse {
  success: boolean;
  vendor: IVendor;
}

interface ClientProfileUpdate {
  name: string;
  email: string;
  phoneNumber: number;
  location: string;
  profileImage?: File | string; 
}


interface VendorProfileUpdate {
    name: string;
    phoneNumber: number;
    location: string;
    languages: string[];
    portfolioWebsite?: string;
    profileDescription: string;
    profileImage?: File | string; 
}

export interface IProfileUpdateResponse {
    success: boolean;
    message: string;
}
export type IProfileUpdate = ClientProfileUpdate | VendorProfileUpdate;
  
export type IProfileInfo =   IVendor | IClient