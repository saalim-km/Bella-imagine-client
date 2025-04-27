import { ChatInterface } from '@/components/chat/ChatInterface'
import { useSocketEvents } from '@/hooks/chat/useSocketEvents'
import { RootState } from '@/store/store'
import { TRole } from '@/types/User'
import { use, useEffect } from 'react'
import { useSelector } from 'react-redux'

const ChatPage = () => {
  const client = useSelector((state: RootState) => state.client.client);
  const vendor = useSelector((state: RootState) => state.vendor.vendor);
  const user = client ? client : vendor;

  // Calling Events
  const {fetchContacts , socket , fetchConversations} = useSocketEvents({userId : user?._id!,userType : user?.role as TRole})
  

  useEffect(()=> {
    fetchConversations()
  },[socket , user?._id , fetchContacts])

  useEffect(()=> {
    fetchContacts()
  },[socket , fetchContacts , user?._id])


  return (
    <ChatInterface/>
  )
}

export default ChatPage