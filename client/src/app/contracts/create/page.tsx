"use client";

import { ContractForm } from "@/components/contract/contractForm";

export default function CreateContractPage() {
  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">
          Create New Contract
        </h2>
        <p className="text-muted-foreground mt-2">
          Fill out the form below to create a new contract.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <ContractForm type="create" />
      </div>
    </>
  );
}
