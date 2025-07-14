import { chatAxionInstance } from "@/api/chat.axios";
import { BasePaginatedResponse } from "../client/clientService";
import { ApiResponse } from "@/hooks/vendor/useVendor";
import { clientAxiosInstance } from "@/api/client.axios";
import { vendorAxiosInstance } from "@/api/vendor.axios";

export interface IUploadMediaResponse {
  key: string;
  mediaUrl: string;
}

export interface CreateConvInput {
  userId: string;
  vendorId: string;
}

export const uploadMediaChatService = async (payload: {
  media: File;
  conversationId: string;
}): Promise<BasePaginatedResponse<IUploadMediaResponse>> => {
  const response = await chatAxionInstance.post("/upload-media", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const createConversationClient = async (input: CreateConvInput): Promise<ApiResponse> => {
  const response = await clientAxiosInstance.post(
    "/client/conversation",
    input
  );
  return response.data;
};

export const createConversationVendor = async (input: CreateConvInput): Promise<ApiResponse> => {
  const response = await vendorAxiosInstance.post(
    "/vendor/conversation",
    input
  );
  return response.data;
};

