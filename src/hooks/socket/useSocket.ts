import { SocketContext } from "@/context/SocketContext";
import { useContext } from "react";

export const useSocket = () => useContext(SocketContext);
