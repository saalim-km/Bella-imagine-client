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
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    setSocketKey((prev) => prev + 1);
  };

  useEffect(() => {
    if (!user || !user._id || !userType) {
      // Disconnect if no user
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }


    // Always create a new socket instance when this effect runs
    const socketInstance = initSocket(user._id, userType);

    if (!socketInstance) {
      return;
    }

    // Join immediately after connection
    socketInstance.on("connect", () => {
      socketInstance.emit("join", { userId: user._id, userType });
      setIsConnected(true);
      setSocket(socketInstance);
    });

    socketInstance.on("new_message_notification", (notification: TNotification) => {
      communityToast.newMessage(notification.message)
      dispatch(addNotification(notification))
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    // Clean up function
    return () => {
      if (socketInstance) {
        socketInstance.off("connect");
        socketInstance.off("disconnect");
        socketInstance.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
    };
  }, [user?._id,userType, socketKey]); // Add socketKey as dependency

  return (
    <SocketContext.Provider value={{ socket, isConnected, reconnect }}>
      {children}
    </SocketContext.Provider>
  );
};