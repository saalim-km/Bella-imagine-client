import { Category } from "@/services/categories/categoryService";
import { IClient } from "@/services/client/clientService";

export interface Community {
  _id: string;
  slug?: string;   
  name: string;
  members: number;
  featured: boolean;
  created: string;
  description?: string;
  coverImage?: string | File
  iconImage?: string | File
  memberCount?: number;
  postCount?: number;
  isPrivate?: boolean;
  isFeatured?: boolean;
  rules?: string[];
  createdAt?: string;
  updatedAt?: string;
}
export interface CommunityResponse {
  _id: string;
  slug?: string;   
  name: string;
  category : Partial<Category>
  members: number;
  featured: boolean;
  created: string;
  description?: string;
  coverImage?: string | File
  iconImage?: string | File
  memberCount?: number;
  postCount?: number;
  isPrivate?: boolean;
  isFeatured?: boolean;
  rules?: string[];
  createdAt?: string;
  updatedAt?: string;
}


export interface IPostRequest {
  _id: string;
  communityId: string;
  userId : string;
  title: string;
  content: string;
  media?: string[];
  voteUpCount: number;
  voteDownCount: number;
  commentCount: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IPostResponse {
  _id: string;
  communityId: string;
  userId : IClient;
  title: string;
  content: string;
  media?: string[];
  voteUpCount: number;
  voteDownCount: number;
  commentCount: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}