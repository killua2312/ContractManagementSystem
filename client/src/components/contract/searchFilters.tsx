"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContractStore } from "@/store/contractStore";
import { ContractStatus } from "@/types/types";

export function SearchFilters() {
  const { filters, setFilters, fetchContracts } = useContractStore();

  const [searchTerm, setSearchTerm] = useState(filters.searchTerm || "");
  const [status, setStatus] = useState<ContractStatus | "All">(
    filters.status || "All",
  );

  const handleSearch = () => {
    setFilters({
      searchTerm: searchTerm || undefined,

      status: status !== "All" ? (status as ContractStatus) : undefined,
      page: 1,
    });
    fetchContracts();
  };

  const handleStatusChange = (value: string) => {
    setStatus(value as ContractStatus | "All");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1 flex items-center space-x-2">
        <div className="relative flex-1">
          <Input
            placeholder="Search by client name or contract ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Finalized">Finalized</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleSearch}>Apply Filters</Button>
      </div>
    </div>
  );
}
