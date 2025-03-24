"use client";

import { useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { useContractStore } from "@/store/contractStore";
import { disconnectSocket, initializeSocket } from "@/utils/socket";

export function Providers({ children }: { children: React.ReactNode }) {
  const { handleNewContract, handleContractUpdate, handleContractDelete } =
    useContractStore();

  useEffect(() => {
    initializeSocket(
      handleNewContract,
      handleContractUpdate,
      handleContractDelete,
    );

    return () => {
      disconnectSocket();
    };
  }, [handleNewContract, handleContractUpdate, handleContractDelete]);

  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
