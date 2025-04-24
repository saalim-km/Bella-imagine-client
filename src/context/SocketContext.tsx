import { RootState } from "@/store/store";
import { createContext, useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import io from "socket.io-client";
import type { Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:3002";
const SOCKET_PATH = "/api/v_1/_chat";

const SocketContext = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const client = useSelector((state: RootState) => state.client.client);
  const vendor = useSelector((state: RootState) => state.vendor.vendor);

  const user = client || vendor;
  const userType = client ? "Client" : vendor ? "Vendor" : undefined;

  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (socket && socket.connected && user  ) {
      return;
    }

    const socketInstance = io(SOCKET_URL, {
      path: SOCKET_PATH,
      reconnection: true,
      transports: ["websocket", "polling"],
      auth: user ? { userId: user._id, userType } : undefined,
    });

    if (user && userType) {
      socketInstance.emit("join", { userId: user._id, userType });
    }

    socketInstance.on("connect", () => {
      console.log("Socket connected:", socketInstance.id);
    });

    socketInstance.on("connect_error", (error: Error) => {
      console.error("Socket connection error:", error.message);
    });

    socketInstance.on("error", (error: { message: string }) => {
      console.error("Socket error from server:", error.message);
      if (error.message.includes("Unauthorized")) {
        socketInstance.disconnect();
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user?._id, userType]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (socket === null) { // Check for null, not undefined, since default is null
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return socket;
};