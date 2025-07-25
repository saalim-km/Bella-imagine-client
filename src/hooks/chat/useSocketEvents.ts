import { TNotification } from "@/components/common/Notification";
import { communityToast } from "@/components/ui/community-toast";
import { useSocket } from "@/hooks/socket/useSocket";
import { setConversations, setMessages, setUsers, updateContactStatus, updateLastSeen } from "@/store/slices/chatSlice";
import { addNotification } from "@/store/slices/notificationSlice";
import { Conversation, Message, User } from "@/types/interfaces/Chat";
import { TRole } from "@/types/interfaces/User";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";

export function useSocketEvents({userId , userType} : {userId : string , userType : TRole}) {
    const {socket} = useSocket();
    const dispatch = useDispatch();

    useEffect(()=> {
        if(!socket || !userId) {
            return;
        }

        socket.on("connect_error", () => {
            communityToast.error({description:"Failed to connect to chat server"});
        });

        socket.emit('join',{userId,userType})

        socket.on('user_status',({userId , userType , status})=> {
            dispatch(updateContactStatus({userId : userId,userType : userType,status : status}))
        })

        socket.on('update_lastseen',({userId , lastSeen})=> {
            dispatch(updateLastSeen({userId: userId , lastSeen : lastSeen}))
        })

        socket.on('messages',(messages : Message[])=> {
            dispatch(setMessages(messages))
        })


        socket.on('notifications' , (notification : TNotification)=> {
            dispatch(addNotification(notification))
        })
        
        return ()=> {
            socket.off('connect_error');
            socket.off('user_status');
            socket.off('update_lastseen');
            socket.off('messages');
        }
    },[socket,userId,userType])

    const fetchContacts = useCallback(()=> {
        if(socket) {
            socket.emit('get_contacts',{userId , userType})
            socket.once('contacts',(contacts : User[])=> {
                dispatch(setUsers(contacts))
            })

        }
    },[socket,userId,userType,dispatch])

    const fetchConversations = useCallback(()=> {
        if(socket){
            socket.emit('get_conversations',{userId,userType})
            socket.once('conversations',(conversations : Conversation[])=> {
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