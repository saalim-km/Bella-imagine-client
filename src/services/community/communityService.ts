import { adminAxiosInstance } from "@/api/admin.axios";
import { clientAxiosInstance } from "@/api/client.axios";
import { ApiResponse } from "@/hooks/vendor/useVendor";
import { AddCommentInput, Community, CommunityBySlugResponse, CommunityResponse, CreatePostInput, EditCommentInput, GetAllPostInput, GetAllPostUserInput, GetCommentsInput, GetCommMemberInput, GetPostForUserOutput, ICommentResponse, PostDetailsInput, PostDetailsResponse } from "@/types/interfaces/Community";
import { PaginatedResponse } from "@/types/interfaces/vendor";
import { BasePaginatedResponse } from "../client/clientService";
import {  ICommunityPostResponse } from "@/components/User/Home";
import { vendorAxiosInstance } from "@/api/vendor.axios";



// Admin service for community

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

export const getAllCommentsByClient = async (input : GetCommentsInput) : Promise<BasePaginatedResponse<PaginatedResponse<ICommentResponse>>> => {
  const response = await clientAxiosInstance.get('/client/comment',{params : input})
  return response.data;
}

export const editCommentByClient = async (input : EditCommentInput) : Promise<ApiResponse>=> {
  const response = await clientAxiosInstance.patch('/client/comment',input)
  return response.data
}

export const deleteCommentClient = async(commentId : string) : Promise<ApiResponse> => {
  const response = await clientAxiosInstance.delete(`/client/comment/${commentId}`)
  return response.data;
}

export const getAllPostForUserServiceClient = async(input : GetAllPostUserInput) : Promise<BasePaginatedResponse<PaginatedResponse<GetPostForUserOutput>>>=> {
  const response = await clientAxiosInstance.get('/client/post',{params : input})
  return response.data
}

export const editPostServiceClient = async (data: any): Promise<ApiResponse> => {
  const response = await clientAxiosInstance.put('/client/community-post', data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deletePostServiceClient = async(postId : string) : Promise<ApiResponse> => {
  const response = await clientAxiosInstance.delete(`/client/post/${postId}`)
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

export const getAllCommentsByVendor = async (input : GetCommentsInput) : Promise<BasePaginatedResponse<PaginatedResponse<ICommentResponse>>> => {
  const response = await vendorAxiosInstance.get('/vendor/comment',{params : input})
  return response.data;
}

export const editCommentByVendor = async (input : EditCommentInput) : Promise<ApiResponse>=> {
  const response = await vendorAxiosInstance.patch('/vendor/comment',input)
  return response.data
}

export const deleteCommentVendor = async(commentId : string) : Promise<ApiResponse> => {
  const response = await vendorAxiosInstance.delete(`/vendor/comment/${commentId}`)
  return response.data;
}

export const getAllPostForUserServiceVendor = async(input : GetAllPostUserInput) : Promise<BasePaginatedResponse<PaginatedResponse<GetPostForUserOutput>>>=> {
  const response = await vendorAxiosInstance.get('/vendor/post',{params : input})
  return response.data
}

export const editPostServiceVendor = async(data : any) : Promise<ApiResponse> => {
  const response = await vendorAxiosInstance.put('/vendor/community-post',data)
  return response.data
}

export const deletePostServiceVendor = async(postId : string) : Promise<ApiResponse> => {
  const response = await vendorAxiosInstance.delete(`/vendor/post/${postId}`)
  return response.data
}