import { z } from "zod";

export const contractSchema = z.object({
  client: z
    .string()
    .min(3, { message: "Client name must be atleast 3 characters" })
    .max(50, { message: "Client name must be atmost 50 characters" }),
  title: z
    .string()
    .min(3, { message: "Title must be atlease 3 characters" })
    .max(50, { message: "Title must be atmost 50 characters" }),
  status: z.enum(["Draft", "Finalized"] as const),
  data: z.string().min(1, { message: "Contract data is required" }),
});

export type ContractFormValues = z.infer<typeof contractSchema>;

export const updateContractSchema = z.object({
  status: z.enum(["Draft", "Finalized"] as const),
  data: z.string().min(1, { message: "Contract data is required" }),
});

export type UpdateContractFormValues = z.infer<typeof updateContractSchema>;

export const searchFilterSchema = z.object({
  status: z.enum(["Draft", "Finalized", ""] as const).optional(),
  searchTerm: z.string().optional(),
  page: z.number().int().positive().default(1),
});

export type SearchFiltersValues = z.infer<typeof searchFilterSchema>;
