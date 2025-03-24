"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useContractStore } from "@/store/contractStore";
import { Contract, ContractStatus } from "@/types/types";
import {
  contractSchema,
  updateContractSchema,
  ContractFormValues,
  UpdateContractFormValues,
} from "@/utils/validations";

interface ContractFormProps {
  type: "create" | "update";
  contract?: Contract;
}

export function ContractForm({ type, contract }: ContractFormProps) {
  const router = useRouter();
  const { createContract, updateContract } = useContractStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = type === "update";

  const form = useForm<ContractFormValues | UpdateContractFormValues>({
    resolver: zodResolver(isEditMode ? updateContractSchema : contractSchema),
    defaultValues:
      isEditMode && contract
        ? {
            status: contract.status,
            data: contract.data,
          }
        : {
            client: "",
            title: "",
            status: "Draft" as ContractStatus,
            data: "",
          },
  });

  const onSubmit = async (
    values: ContractFormValues | UpdateContractFormValues,
  ) => {
    setIsSubmitting(true);

    try {
      if (isEditMode && contract) {
        const updatedValues = values as UpdateContractFormValues;
        await updateContract(contract.id, {
          status: updatedValues.status,
          data: updatedValues.data,
        });

        toast("The Contract has been successfully updated");

        router.push(`/contracts/${contract.id}`);
      } else {
        const newValues = values as ContractFormValues;
        await createContract(newValues);

        toast("The Contract has been successfully Created");

        router.push("/contracts");
      }
    } catch (error) {
      console.error("Error submitting contract form:", error);
      if (isEditMode) {
        toast("Failed to update the contract. Please try again.");
      } else {
        toast("Failed to create the contract. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {!isEditMode && (
          <>
            <FormField
              control={form.control}
              name="client"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter client name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contract title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {isEditMode && contract && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium mb-1">Client</h3>
                <p className="text-sm text-muted-foreground">
                  {contract.client}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Title</h3>
                <p className="text-sm text-muted-foreground">
                  {contract.title}
                </p>
              </div>
            </div>
          </>
        )}

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Finalized">Finalized</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="data"
          render={({ field }) => {
            let formattedValue = field.value;
            try {
              const parsedValue = JSON.parse(field.value);
              formattedValue = JSON.stringify(parsedValue, null, 2);
            } catch {
              formattedValue = field.value;
            }

            return (
              <FormItem>
                <FormLabel>Contract Data</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter contract details..."
                    className="h-32 min-h-[18rem] font-mono"
                    {...field}
                    value={formattedValue}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {isEditMode ? "Updating..." : "Creating..."}
              </>
            ) : isEditMode ? (
              "Update Contract"
            ) : (
              "Create Contract"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
