import { io, Socket } from "socket.io-client";
import { Contract } from "@/types/types";

let socket: Socket | null = null;

export const initializeSocket = (
  onNewContract: (contract: Contract) => void,
  onContractUpdate: (contracts: Contract[]) => void,
  onContractDelete: (data: { deletedId: string }) => void,
) => {
  const SOCKET_URL =
    process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

  if (!socket) {
    socket = io(SOCKET_URL);

    socket.on("connect", () => {
      console.log("Socket connection");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  }

  socket.off("newContract");
  socket.off("contractUpdate");
  socket.off("contractDelete");

  socket.on("newContract", onNewContract);
  socket.on("contractUpdate", onContractUpdate);
  socket.on("contractDelete", onContractDelete);

  return socket;
};

export const getSocket = () => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
