import { adminAxiosInstance } from "@/api/admin.axios";
import { clientAxiosInstance } from "@/api/client.axios";
import { ApiResponse } from "@/hooks/vendor/useVendor";
import { Community, CommunityResponse } from "@/types/interfaces/Community";
import { PaginatedResponse } from "@/types/interfaces/vendor";
import { BasePaginatedResponse, IClient } from "../client/clientService";
import { ICommunityPost, ICommunityPostResponse } from "@/components/User/Home";

export interface CommunityBySlugResponse {
  community: CommunityResponse;
  isMember: boolean;
}

export interface GetCommMemberInput {
  communityId: string;
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
  enabled ?: boolean
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




export const getCommunityMembersService = async (input: GetCommMemberInput) => {
  const respone = await adminAxiosInstance.get(
    `/community/members/${input.communityId}`,
    {
      params: {
        limit: input.limit,
        page: input.page,
      },
    }
  );
};


// client service

export const getAllCommunities = async (dto: {
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

export const joinCommunityService = async (
  communtyId: string
): Promise<ApiResponse> => {
  const response = await clientAxiosInstance.post(`/client/community-join`, {
    communityId: communtyId,
  });
  return response.data;
};

export const leaveCommunityService = async (
  communityId: string
): Promise<ApiResponse> => {
  const response = await clientAxiosInstance.delete(
    `/client/community-leave/${communityId}`
  );
  return response.data;
};

export const createPostService = async(input : CreatePostInput) : Promise<BasePaginatedResponse<ICommunityPostResponse>>=> {
    const response = await clientAxiosInstance.post('/client/community-post',input)
    return response.data
}

export const getAllPostService = async(input : GetAllPostInput) : Promise<BasePaginatedResponse<PaginatedResponse<ICommunityPostResponse>>> => {
  const response = await clientAxiosInstance.get('/client/community-post',{params : input})
  return response.data
}


export const getPostDetails = async(input : PostDetailsInput) : Promise<BasePaginatedResponse<PostDetailsResponse>>=> {
  const response = await clientAxiosInstance.get(`/client/post/${input.postId}`,{params : {page : input.page , limit : input.limit}})
  return response.data;
}

export const addCommentService = async(input : AddCommentInput) : Promise<ApiResponse> => {
  const response = await clientAxiosInstance.post('/client/comment',input)
  return response.data
}