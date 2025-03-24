import { create } from "zustand";
import api from "@/utils/api";
import {
  Contract,
  Filters,
  ContractResponse,
  CreateContractData,
  UpdateContractData,
} from "@/types/types";

interface ContractsState {
  contracts: Contract[];
  total: number;
  isLoading: boolean;
  error: string | null;
  filters: Filters;

  setFilters: (filters: Partial<Filters>) => void;
  fetchContracts: () => Promise<void>;
  getContract: (id: string) => Promise<Contract>;
  createContract: (data: CreateContractData) => Promise<Contract>;
  updateContract: (id: string, data: UpdateContractData) => Promise<Contract>;
  deleteContract: (
    id: string,
  ) => Promise<{ success: boolean; deletedId: string }>;

  handleNewContract: (contract: Contract) => void;
  handleContractUpdate: (updatedContracts: Contract[]) => void;
  handleContractDelete: (data: { deletedId: string }) => void;
}

export const useContractStore = create<ContractsState>((set, get) => ({
  contracts: [],
  total: 0,
  isLoading: false,
  error: null,
  filters: {
    page: 1,
    limit: 10,
  },

  setFilters: (filters) => {
    set((state) => ({
      filters: {
        ...state.filters,
        ...filters,
      },
    }));
  },

  fetchContracts: async () => {
    const { filters } = get();
    try {
      set({ isLoading: true, error: null });

      const params = {
        ...(filters.status && { status: filters.status }),
        ...(filters.searchTerm && { searchTerm: filters.searchTerm }),
        page: filters.page,
      };

      const res = await api.get<ContractResponse>(`/contracts`, { params });

      set({
        contracts: res.data.results,
        total: res.data.total,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error fetching contracts:", error);
      set({
        error: "Failed to fetch contracts",
        isLoading: false,
      });
    }
  },

  getContract: async (id: string) => {
    try {
      const res = await api.get<Contract>(`/contracts/${id}`);
      return res.data;
    } catch (error) {
      console.error("Error creating contract:", error);
      throw new Error("Failed to create contract");
    }
  },

  createContract: async (data: CreateContractData) => {
    try {
      const res = await api.post<Contract>("/contracts", data);
      return res.data;
    } catch (error) {
      console.error("Error creating contract:", error);
      throw new Error("Failed to create contract");
    }
  },

  updateContract: async (id: string, data: UpdateContractData) => {
    try {
      const res = await api.put<{ result: Contract[] }>(
        `/contracts/${id}`,
        data,
      );
      return res.data.result[0];
    } catch (error) {
      console.error(`Error updating contract ${id}`, error);
      throw new Error("Failed to update contract");
    }
  },

  deleteContract: async (id: string) => {
    try {
      const res = await api.delete<{ success: boolean; deletedId: string }>(
        `/contracts/${id}`,
      );
      return res.data;
    } catch (error) {
      console.error(`Error deleting contract ${id}`, error);
      throw new Error("Failed to delete contract");
    }
  },

  handleNewContract: (contract: Contract) => {
    const { filters, fetchContracts } = get();

    const statusMatch = !filters.status || contract.status === filters.status;
    const searchMatch =
      !filters.searchTerm ||
      contract.client.toLowerCase().includes(filters.searchTerm.toLowerCase());

    if (
      (statusMatch && searchMatch && filters.page === 1) ||
      (!filters.status && !filters.searchTerm && filters.page === 1)
    ) {
      fetchContracts();
    }
  },

  handleContractUpdate: (updatedContracts: Contract[]) => {
    if (!updatedContracts || updatedContracts.length === 0) return;

    const updatedContract = updatedContracts[0];
    const { contracts, filters, fetchContracts } = get();

    const contractIndex = contracts.findIndex(
      (c) => c.id === updatedContract.id,
    );

    if (contractIndex >= 0) {
      set({
        contracts: contracts.map((c) =>
          c.id === updatedContract.id ? updatedContract : c,
        ),
      });
    } else {
      const statusMatch =
        !filters.status || updatedContract.status === filters.status;
      const searchMatch =
        !filters.searchTerm ||
        updatedContract.client
          .toLowerCase()
          .includes(filters.searchTerm.toLowerCase());

      if (statusMatch && searchMatch) {
        fetchContracts();
      }
    }
  },

  handleContractDelete: (data: { deletedId: string }) => {
    const { contracts, fetchContracts } = get();

    const contractExists = contracts.some((c) => c.id === data.deletedId);

    if (contractExists) {
      fetchContracts();
    }
  },
}));
