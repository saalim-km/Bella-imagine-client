import { Category } from "@/services/categories/categoryService";
import { IClient } from "@/services/client/clientService";
import { IVendor } from "@/services/vendor/vendorService";
import { IService, IServiceResponse, IWorkSampleResponse } from "./vendor";
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
  imageFile ?: File
}


interface VendorProfileUpdate {
    name: string;
    phoneNumber: number;
    location: string;
    languages: string[];
    portfolioWebsite?: string;
    profileDescription: string;
    profileImage?: File | string; 
    verificationDocuments : string[]
    imageFile ?: File
}

export interface IProfileUpdateResponse {
    success: boolean;
    message: string;
}
export type IProfileUpdate = ClientProfileUpdate | VendorProfileUpdate;
  
export type IProfileInfo =   IVendor | IClient



export interface IVendorsFilter {
  location ?: string;
  languages?: string;
  category ?: string;
  minCharge?: number;
  maxCharge?: number;
  page?: number;
  limit?: number;
}

export interface IVendorsResponse extends IClient {
  vendorId ?: string,
  portfolioWebsite : string;
  languages ?: string[];
  description ?: string;
  verificationDocument : string
  yearsOfExperience : number,
  categories : Category[],
  services : IServiceResponse[],
  workSamples : IWorkSampleResponse[],
  isVerified ?: "pending" | "accept" |  "reject"
}


// Booking types
export interface Booking {
  vendorId: string;
  serviceId: string;
  bookingDate: string;
  timeSlot: {
    startTime: string;
    endTime: string;
  };
    location: {
    lat: number
    lng: number
  }
  distance : number;
  customLocation : string;
  travelTime : string;
  travelFee : number;
  totalPrice: number;
}