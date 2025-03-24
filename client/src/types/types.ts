export type ContractStatus = "Draft" | "Finalized";

export interface Contract {
  id: string;
  client: string;
  title: string;
  status: ContractStatus;
  data: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Filters {
  status?: ContractStatus;
  searchTerm?: string;
  page: number;
}

export interface ContractResponse {
  total: number;
  page: number;
  limit: number;
  results: Contract[];
}

export interface CreateContractData {
  client: string;
  title: string;
  status: ContractStatus;
  data: string;
}

export interface UpdateContractData {
  status?: ContractStatus;
  data?: string;
}
