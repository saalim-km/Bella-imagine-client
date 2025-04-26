import { chatAxiosInstance } from '@/api/chat.axios'
import { ChatInterface } from '@/components/chat/ChatInterface'
import { Spinner } from '@/components/ui/spinner'
import { useSocket } from '@/context/SocketContext'
import { useContactsQuery, useConversations } from '@/hooks/chat/useChat'
import { useSocketEvents } from '@/hooks/chat/useSocketEvents'
import { getConversations } from '@/services/chat/chatService'
import { setConversations, setUsers } from '@/store/slices/chatSlice'
import { RootState } from '@/store/store'
import { TRole } from '@/types/User'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'

const ChatPage = () => {
  const client = useSelector((state: RootState) => state.client.client);
  const vendor = useSelector((state: RootState) => state.vendor.vendor);
  const dispatch = useDispatch()
  // initializing events
  useSocketEvents()
  const user = client ? client : vendor;
  const {data : contacts , isLoading , isError} = useContactsQuery({userId :  user?._id as string, userType : user?.role as TRole })
  const {data : conversations} = useConversations({userId : user?._id as string, userType : user?.role!})
  console.log('got converasations :',conversations);
  if(contacts && conversations) {
    dispatch(setUsers(contacts))
    dispatch(setConversations(conversations))
  }
  

  if(isLoading) {
    return(
      <Spinner/>
    )
  }
  return (
    <ChatInterface/>
  )
}

export default ChatPage