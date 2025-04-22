import { RootState } from "@/store/store";
import { createContext, useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import type { Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3002";
const SOCKET_PATH = "/api/v_1/_chat";

const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const client = useSelector((state: RootState) => state.client.client);
  const vendor = useSelector((state: RootState) => state.vendor.vendor);

  const user = client || vendor;
  const userType = client ? "Client" : vendor ? "Vendor" : undefined;

  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    if (socket && socket.connected) {
      return;
    }

    if (!user || !userType) {
      setConnectionError("No user data available");
      return;
    }

    const socketInstance = io(SOCKET_URL, {
      path: SOCKET_PATH,
      reconnection: true,
      transports: ["websocket", "polling"],
      auth: { userId: user._id, userType },
      withCredentials: true,
    });

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
      setConnectionError(null);
    });

    socketInstance.on("connect_error", (error: Error) => {
      console.error("Socket connection error:", error.message);
      setConnectionError(error.message);
    });

    socketInstance.on("error", (error: { message: string }) => {
      console.error("Socket error from server:", error.message);
      if (error.message.includes("Unauthorized")) {
        socketInstance.disconnect();
        socketInstance.io.opts.reconnection = false;
        setSocket(null);
        setConnectionError("Unauthorized: Please log in again.");
      }
    });

    socketInstance.on("reconnect_attempt", () => {
      console.log("Attempting to reconnect...");
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user?._id, userType]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (socket === null) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return socket;
};