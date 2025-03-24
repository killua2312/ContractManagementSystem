"use client";

import { useEffect } from "react";
import { SearchFilters } from "@/components/contract/searchFilters";
import { ContractTable } from "@/components/contract/contractTable";
import { useContractStore } from "@/store/contractStore";

export default function ContractsPage() {
  const { fetchContracts, setFilters } = useContractStore();

  useEffect(() => {
    setFilters({
      page: 1,
      status: undefined,
      searchTerm: undefined,
    });
    fetchContracts();
  }, [fetchContracts, setFilters]);

  return (
    <>
      <h2 className="text-3xl font-bold tracking-tight mb-6">Contracts</h2>
      <SearchFilters />
      <ContractTable />
    </>
  );
}
