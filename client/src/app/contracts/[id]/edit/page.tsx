"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ContractForm } from "@/components/contract/contractForm";
import { useContractStore } from "@/store/contractStore";
import { Contract } from "@/types/types";

export default function EditContractPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const { getContract } = useContractStore();
  const [contract, setContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchContract() {
      try {
        const data = await getContract(id);
        setContract(data);
      } catch (error) {
        console.error("Error fetching contract:", error);
        toast("Failed to load contract details.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchContract();
  }, [id, getContract]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-2">Contract Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The contract you are trying to edit does not exist or has been
          deleted.
        </p>
        <Button asChild>
          <Link href="/contracts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Contracts
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <Button variant="ghost" size="sm" asChild className="mb-2">
          <Link href={`/contracts/${contract.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Contract
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Edit Contract</h2>
        <p className="text-muted-foreground mt-2">
          Update contract information below.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <ContractForm type="update" contract={contract} />
      </div>
    </>
  );
}
