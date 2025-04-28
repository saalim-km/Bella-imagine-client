

import { chatAxiosInstance } from "@/api/chat.axios";
import { TRole } from "@/types/User";

export const getContacts = async(userId : string , userType : TRole)=> {
  const response = await chatAxiosInstance.get(`/${userId}/${userType}`)
  console.log(response);
  return response.data;
}

export const getConversations = async(userId : string , userType : string)=> {
  console.log('before calling getconversation');
  console.log(userType);
  const response = await chatAxiosInstance.get(`/conversations/${userId}/${userType}`)
  console.log(response.data);
  return response.data
}
