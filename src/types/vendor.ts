import { Category } from "@/services/categories/categoryService";

// --------------------------Service Managment Types-----------------------------------------------------------------||
export interface TimeSlot {
  startTime: string;
  endTime: string;
  capacity: number;
}

export interface DateSlot {
  date: string;
  timeSlots: TimeSlot[];
}

export interface SessionDuration {
  durationInHours: number;
  price: number;
}

export interface RecurringAvailability {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface Location {
  options: {
    studio: boolean;
    onLocation: boolean;
  };
  travelFee: number;
  city: string;
  state: string;
  country: string;
}

export interface CustomField {
  name: string;
  type: string;
  required: boolean;
  options: string[];
}

export interface DepositRequirement {
  amount: number;
  isPercentage: boolean;
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
  customFields: CustomField[];
  isPublished?: boolean;
}

export interface IServiceResponse {
  _id ?: string;
  serviceTitle: string;
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
  customFields: CustomField[];
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

// --------------------------Work-Sample Managment Types-----------------------------------------------------------------||
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

type TMedia = {
  url: string;
  type: "image" | "video";
}

type TComment = {
  user: string;
  text: string;
  createdAt: Date;
}

export interface IWorkSampleRequest {
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
  service: string;
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