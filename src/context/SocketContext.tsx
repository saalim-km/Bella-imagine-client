import React, { createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { initSocket } from "@/config/socket";
import { Socket } from "socket.io-client";
import { TNotification } from "@/components/common/Notification";
import { useDispatch } from "react-redux";
import { addNotification } from "@/store/slices/notificationSlice";
import { communityToast } from "@/components/ui/community-toast";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  reconnect: () => void;
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  reconnect: () => {},
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch()
  const client = useSelector((state: RootState) => state.client.client);
  const vendor = useSelector((state: RootState) => state.vendor.vendor);
  const user = client || vendor;
  const userType = client ? "client" : vendor ? "vendor" : undefined;

  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [socketKey, setSocketKey] = useState(0); // Add a key to force re-initialization

  // Function to force socket reconnection
  const reconnect = () => {
    console.log("Forcing socket reconnection");
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    setSocketKey((prev) => prev + 1);
  };

  useEffect(() => {
    console.log(user);
    if (!user || !user._id || !userType) {
      // Disconnect if no user
      if (socket) {
        console.log("No user, disconnecting socket");
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    console.log("Initializing socket connection for", user._id, userType);

    // Always create a new socket instance when this effect runs
    const socketInstance = initSocket(user._id, userType);

    if (!socketInstance) {
      console.error("Failed to initialize socket");
      return;
    }

    // Join immediately after connection
    socketInstance.on("connect", () => {
      console.log('user to connect the socket : ',user);
      console.log("Socket connected ✅", socketInstance.id);
      socketInstance.emit("join", { userId: user._id, userType });
      setIsConnected(true);
      setSocket(socketInstance);
    });

    socketInstance.on("new_message_notification", (notification: TNotification) => {
      console.log(notification);
      communityToast.newMessage(notification.message)
      dispatch(addNotification(notification))
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    // Clean up function
    return () => {
      console.log("Cleaning up socket connection");
      if (socketInstance) {
        socketInstance.off("connect");
        socketInstance.off("disconnect");
        socketInstance.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
    };
  }, [dispatch,socket,user,userType, socketKey]); // Add socketKey as dependency

  return (
    <SocketContext.Provider value={{ socket, isConnected, reconnect }}>
      {children}
    </SocketContext.Provider>
  );
};

