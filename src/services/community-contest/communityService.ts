import { adminAxiosInstance } from "@/api/admin.axios";
import { clientAxiosInstance } from "@/api/client.axios";
import { ApiResponse } from "@/hooks/vendor/useVendor";
import { Community, CommunityResponse } from "@/types/interfaces/Community";
import { PaginatedResponse } from "@/types/interfaces/vendor";
import { BasePaginatedResponse, IClient } from "../client/clientService";
import { ICommunityPostResponse } from "@/components/User/Home";
import { vendorAxiosInstance } from "@/api/vendor.axios";

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

export interface PostDetailsResponse extends Pick<IClient,'name' | 'profileImage'> , Omit<ICommunityPostResponse,'comments'> {
  likes : ILike;
  comments : IComment[];
  totalComments : number
}

export interface AddCommentInput {
  postId : string;
  content : string;
}


export interface PostDetailsInput {
  postId : string;
  limit : number;
  page : number;
  enabled : boolean
}

export const createCommunityService = async (
  dto: Partial<Community>
): Promise<ApiResponse> => {
  const response = await adminAxiosInstance.post("/community", dto, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getAllCommunitesAdmin = async (dto: {
  page: number;
  limit: number;
  search: string;
}): Promise<BasePaginatedResponse<PaginatedResponse<CommunityResponse>>> => {
  const response = await adminAxiosInstance.get("/community", { params: dto });
  return response.data;
};

export const deleteCommunityService = async (
  communityId: string
): Promise<ApiResponse> => {
  console.log("community delte service trigger : ", communityId);
  const response = await adminAxiosInstance.delete(`/community`, {
    data: { communityId: communityId },
  });
  return response.data;
};

export const getCommunityBySlugService = async (
  slug: string
): Promise<BasePaginatedResponse<CommunityBySlugResponse>> => {
  const response = await adminAxiosInstance.get(`/community/${slug}`);
  return response.data;
};

export const updateCommunityService = async (
  dto: Partial<Community>
): Promise<ApiResponse> => {
  const response = await adminAxiosInstance.put(`/community`, dto, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};


export const getCommunityMemersAdmin = async (input: GetCommMemberInput) => {
  const respone = await adminAxiosInstance.get(
    `/${input.slug}/members`,
    {
      params: {
        limit: input.limit,
        page: input.page,
      },
    }
  );

  return respone.data;
};


// client service for fommunity

export const getAllCommunitiesClient = async (dto: {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  membership?: string;
  sort?: string;
}): Promise<BasePaginatedResponse<PaginatedResponse<CommunityResponse>>> => {
  const response = await clientAxiosInstance.get("/client/community", {
    params: dto,
  });
  return response.data;
};

export const getCommunityBySlugForClient = async (
  slug: string
): Promise<BasePaginatedResponse<CommunityBySlugResponse>> => {
  const response = await clientAxiosInstance.get(`/client/community/${slug}`);
  return response.data;
};

export const joinCommunityServiceClient = async (
  communtyId: string
): Promise<ApiResponse> => {
  const response = await clientAxiosInstance.post(`/client/community-join`, {
    communityId: communtyId,
  });
  return response.data;
};

export const leaveCommunityServiceClient = async (
  communityId: string
): Promise<ApiResponse> => {
  const response = await clientAxiosInstance.delete(
    `/client/community-leave/${communityId}`
  );
  return response.data;
};

export const createPostServiceClient = async(input : CreatePostInput) : Promise<BasePaginatedResponse<ICommunityPostResponse>>=> {
    const response = await clientAxiosInstance.post('/client/community-post',input)
    return response.data
}

export const getAllPostServiceClient = async(input : GetAllPostInput) : Promise<BasePaginatedResponse<PaginatedResponse<ICommunityPostResponse>>> => {
  const response = await clientAxiosInstance.get('/client/community-post',{params : input})
  return response.data
}

export const getPostDetailsClient = async(input : PostDetailsInput) : Promise<BasePaginatedResponse<PostDetailsResponse>>=> {
  const response = await clientAxiosInstance.get(`/client/post/${input.postId}`,{params : {page : input.page , limit : input.limit}})
  return response.data;
}

export const addCommentServiceClient = async(input : AddCommentInput) : Promise<ApiResponse> => {
  const response = await clientAxiosInstance.post('/client/comment',input)
  return response.data
}


// vendor service for community
export const getAllCommunitiesVendor = async (dto: {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  membership?: string;
  sort?: string;
}): Promise<BasePaginatedResponse<PaginatedResponse<CommunityResponse>>> => {
  const response = await vendorAxiosInstance.get("/vendor/community", {
    params: dto,
  });
  return response.data;
};

export const getCommunityBySlugForVendor = async (
  slug: string
): Promise<BasePaginatedResponse<CommunityBySlugResponse>> => {
  const response = await vendorAxiosInstance.get(`/vendor/community/${slug}`);
  return response.data;
};

export const joinCommunityServiceVendor = async (
  communtyId: string
): Promise<ApiResponse> => {
  const response = await vendorAxiosInstance.post(`/vendor/community-join`, {
    communityId: communtyId,
  });
  return response.data;
};

export const leaveCommunityServiceVendor = async (
  communityId: string
): Promise<ApiResponse> => {
  const response = await vendorAxiosInstance.delete(
    `/vendor/community-leave/${communityId}`
  );
  return response.data;
};

export const createPostServiceVendor = async(input : CreatePostInput) : Promise<BasePaginatedResponse<ICommunityPostResponse>>=> {
    const response = await vendorAxiosInstance.post('/vendor/community-post',input)
    return response.data
}

export const getAllPostServiceVendor = async(input : GetAllPostInput) : Promise<BasePaginatedResponse<PaginatedResponse<ICommunityPostResponse>>> => {
  const response = await vendorAxiosInstance.get('/vendor/community-post',{params : input})
  return response.data
}

export const getPostDetailsVendor = async(input : PostDetailsInput) : Promise<BasePaginatedResponse<PostDetailsResponse>>=> {
  const response = await vendorAxiosInstance.get(`/vendor/post/${input.postId}`,{params : {page : input.page , limit : input.limit}})
  return response.data;
}

export const addCommentServiceVendor = async(input : AddCommentInput) : Promise<ApiResponse> => {
  const response = await vendorAxiosInstance.post('/vendor/comment',input)
  return response.data
}