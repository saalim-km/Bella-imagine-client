import { ChatInterface } from '@/components/chat/ChatInterface'
import { useSocket } from '@/context/SocketContext'
import { useSocketEvents } from '@/hooks/chat/useSocketEvents'
import { RootState } from '@/store/store'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

const ChatPage = () => {
  const client = useSelector((state: RootState) => state.client.client);
  const vendor = useSelector((state: RootState) => state.vendor.vendor);
  const {socket , isConnected} = useSocket()
  // initializing events
  useSocketEvents()
  const user = client ? client : vendor;

  console.log('user type : ',user?.role);
  console.log('user : ',user);

  console.log('socket connection : ',isConnected);
  console.log('socket object : ',socket);

  useEffect(()=> {
    if(socket && isConnected) {
      socket.emit('get_contacts',{userId : user?._id, userType : user?.role})
      socket.emit('get_conversations',{userId : user?._id, userType : user?.role})
    }
  },[socket , isConnected])

  return (
    <ChatInterface/>
  )
}

export default ChatPage