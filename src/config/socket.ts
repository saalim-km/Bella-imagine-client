// src/socket/socket.ts
import { io, Socket } from "socket.io-client";
import { TRole } from "@/types/User";

const SOCKET_URL = "http://localhost:3002";
const SOCKET_PATH = "/path/_chat";

let socket: Socket | null = null;

export const initSocket = (userId: string, userType: TRole): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      path: SOCKET_PATH,
      transports: ["websocket", "polling"],
      reconnection: true,
      auth: { userId, userType },
    });
  }

  return socket;
};

export const getSocket = (): Socket | null => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
