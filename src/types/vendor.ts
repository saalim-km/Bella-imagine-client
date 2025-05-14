import { Category } from "@/services/categories/categoryService";
import { IVendorReponse } from "./User";
import { IVendor } from "@/services/vendor/vendorService";

// -----------common type-------------|
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}


// --------------------------Service Managment Types-----------------------------------------------------------------||
export interface TimeSlot {
  startTime: string;
  endTime: string;
  capacity: number;
  isBooked?: boolean;
}

export interface DateSlot {
  date: string;
  timeSlots: TimeSlot[];
}

export interface SessionDuration {
  durationInHours: number;
  price: number;
  _id ?: string;
}

export interface BookingState {
  selectedDate: string | null;
  selectedTimeSlot: TimeSlot | null;
  selectedDuration: SessionDuration | null;
  vendorId ?: string,
  location : {
    lat: number;
    lng: number;
  }
}

export interface Location {
  travelFee : number;
  lat : number;
  lng : number;
}

export interface IService {
  _id ?: string;
  serviceTitle: string;
  category: string;
  yearsOfExperience: number;
  styleSpecialty: string[];
  tags: string[];
  serviceDescription: string;
  sessionDurations: SessionDuration[];
  features: string[];
  availableDates: DateSlot[];
  location: Location;
  equipment: string[];
  cancellationPolicies: string[];
  termsAndConditions: string[];
  isPublished?: boolean;
}

export interface IServiceResponse {
  _id ?: string;
  serviceTitle: string;
  vendorId ?: string;
  category: Category
  yearsOfExperience: number;
  styleSpecialty: string[];
  tags: string[];
  serviceDescription: string;
  sessionDurations: SessionDuration[];
  features: string[];
  availableDates: DateSlot[];
  location: Location;
  equipment: string[];
  cancellationPolicies: string[];
  termsAndConditions: string[];
  isPublished?: boolean;
  __v ?: number;
}

export interface IServiceFilter {
  serviceTitle?: string;
  category?: string; 
  location?: string;
  tags?: string[];
  styleSpecialty?: string[];
  isPublished?: boolean;
  createdAt?: 1 | -1;
  page ?: number;
  limit ?: number
}


// --------------------------Work-Sample Managment Types-----------------------------||

type TMedia = {
  url: string;
  type: "image" | "video";
}

type TComment = {
  user: string;
  text: string;
  createdAt: Date;
}

export type TService = {
  _id ?:  string,
  vendor: string ,
  serviceTitle: string,
  category: string,
  yearsOfExperience: number,
  styleSpecialty: string[],
  tags: string[],
  serviceDescription: string,
  sessionDurations: SessionDuration[],
  features: string[],
  availableDates: DateSlot[],
  location: Location,
  equipment: string[],
  cancellationPolicies: string[],
  termsAndConditions: string[],
  isPublished?: boolean,
  createdAt ?: string,
  updatedAt ?: string
}

export interface IWorkSampleRequest {
  _id ?: string;
  vendor ?: string;
  service: string;
  title: string;
  description: string;
  media: TMedia[];
  tags?: string[];
  likes?: string[];
  comments?: TComment;
  isPublished: boolean;
}

export interface IWorkSampleResponse {
  _id ?: string;
  service: TService;
  vendor: string;
  title: string;
  description?: string;
  media: TMedia[];
  tags?: string[];
  likes?: string[];
  comments?: TComment[]
  isPublished: boolean;
  createdAt: Date;
  __v ?: number;
}

export interface IWorkSampleFilter {
  title?: string;
  service?: string; 
  tags?: string[];
  isPublished?: boolean;
  createdAt?: 1 | -1;
  page ?: number;
  limit ?: number
}



// vendor details type

export type TsamplePagination = {
  page: number;
  limit: number;
  total: number;
}

export type TservicePagination = {
  page: number;
  limit: number;
  total: number;
}
export interface IVendorDetails extends IVendor {
  services : IServiceResponse[];
  samplePagination : TsamplePagination;
  servicePagination : TservicePagination;
}