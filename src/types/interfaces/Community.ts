import { ICommunityPostResponse } from "@/components/User/Home";
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
  description?: string;
  coverImage?: string 
  iconImage?: string 
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

export interface CommunityBySlugResponse {
  community: CommunityResponse;
  isMember: boolean;
}

export interface GetCommMemberInput {
  slug : string;
  limit: number;
  page: number;
}

export interface CreatePostInput {
  communityId: string;
  title: string;
  content: string;
  media?: File[];
  mediaType?: "image" | "video" | "mixed" | "none";
  tags: string[];
}

export interface PostDetailsInput {
  postId : string;
  limit : number;
  page : number;
  enabled : boolean
}
export interface IComment {
  _id?: string
  postId: string
  userId: {
    _id: string
    name: string
    profileImage?: string
    email: string
  }
  userName ?: string;
  avatar ?: string
  content: string
  likesCount: number
  createdAt?: Date
  updatedAt?: Date
}

export interface GetAllPostInput {
  page : number;
  limit : number;
  communityId ?: string;
  enabled ?: boolean;
}

export interface ILike {
  _id?: string;
  userId : {
    name : string;
    profileImage : string
  }
  postId : string;
  userType : 'Client' | 'Vendor';
  createdAt ?: string;
  updatedAt ?: string;
}

export interface PostDetailsResponse extends Omit<ICommunityPostResponse,'comments'> {
  likes : ILike;
  comments : IComment[];
  totalComments : number
  userName : string;
  avatar : string;
}

export interface AddCommentInput {
  postId : string;
  content : string;
}

export interface GetCommentsInput {
  page : number;
  limit : number;
  enabled : boolean
}