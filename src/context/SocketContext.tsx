// src/socket/SocketProvider.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { initSocket, getSocket } from "@/config/socket"
import { Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const client = useSelector((state: RootState) => state.client.client);
  const vendor = useSelector((state: RootState) => state.vendor.vendor);
  const user = client || vendor;
  const userType = client ? "client" : vendor ? "vendor" : undefined;

  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!user || !user._id || !userType) return;

    if(socket) {
      socket.disconnect()
    }

    const socketInstance = initSocket(user._id, userType);

    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Socket connected ✅", socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    return () => {
      if(socketInstance) {
        socketInstance.off("connect");
        socketInstance.off("disconnect")
        socketInstance.disconnect()
      }
    };
  }, [user?._id , userType]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
