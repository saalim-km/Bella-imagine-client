import { useSocket } from "@/context/SocketContext";
import { setConversations, setMessages, setUsers, updateContactStatus, updateLastSeen } from "@/store/slices/chatSlice";
import { Conversation, Message, User } from "@/types/Chat";
import { TRole } from "@/types/User";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export function useSocketEvents({userId , userType} : {userId : string , userType : TRole}) {
    console.log('use socket triggered',userId);
    const {socket} = useSocket();
    const dispatch = useDispatch();

    useEffect(()=> {
        if(!socket || !userId) {
            return;
        }

        socket.on("connect_error", () => {
            toast.error("Failed to connect to chat server");
          });

        socket.emit('join',{userId,userType})

        socket.on('user_status',({userId , userType , status})=> {
            console.log('user status event trigger 😘');
            dispatch(updateContactStatus({userId : userId,userType : userType,status : status}))
        })

        socket.on('update_lastseen',({userId , lastSeen})=> {
            console.log(`in update_lastseen event in frontend ${userId} , lastseen : ${lastSeen}`);
            dispatch(updateLastSeen({userId: userId , lastSeen : lastSeen}))
        })

        socket.on('messages',(messages : Message[])=> {
            console.log('go the messages',messages);
            dispatch(setMessages(messages))
        })
        
        return ()=> {
            socket.off('connect_error');
            socket.off('user_status');
        }
    },[socket,userId,userType])

    const fetchContacts = useCallback(()=> {
        if(socket) {
            socket.emit('get_contacts',{userId , userType})
            socket.once('contacts',(contacts : User[])=> {
                console.log('got the contacts :',contacts);
                dispatch(setUsers(contacts))
            })

        }
    },[socket,userId,userType,dispatch])

    const fetchConversations = useCallback(()=> {
        if(socket){
            socket.emit('get_conversations',{userId,userType})
            socket.once('conversations',(conversations : Conversation[])=> {
                console.log('got the conversations : ',conversations);
                dispatch(setConversations(conversations))
            })
        }
    },[socket , userId , userType , dispatch])

    const fetchMessages = useCallback((conversationId : string)=> {
        if(socket) {
            socket.emit('get_messages',{conversationId})
        }
    },[socket,userId,userType,dispatch])


    return { socket , fetchContacts , fetchConversations , fetchMessages}
}