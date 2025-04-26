import { useSocket } from "@/context/SocketContext"
import { setConversations, setMessages, setUsers } from "@/store/slices/chatSlice";
import { Message, User } from "@/types/Chat";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const useSocketEvents = ()=> {
    const dispatch = useDispatch()
    const {socket} = useSocket();

    useEffect(()=> {
        if(!socket) return;

        const handleContacts = (contacts : User[])=> {
            console.log('got the contacts->>>');
            console.log(contacts);
            dispatch(setUsers(contacts))
        }
        
        const handleConversations = (conversations : any)=> {
            console.log('go the conversations->>>>>');
            console.log(conversations);
            dispatch(setConversations(conversations))
        }

        const handleMessages = (messages : Message[]) => {
            console.log('got the messages : ',messages);
            dispatch(setMessages(messages))
        }

        socket.on('contacts',handleContacts);
        socket.on('conversations',handleConversations)
        socket.on('messages',handleMessages)
    },[socket])
}