"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Edit, Trash2, ArrowLeft } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useContractStore } from "@/store/contractStore";
import { Contract } from "@/types/types";
import { formatDate } from "@/utils/format";

export default function ContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const { getContract, deleteContract } = useContractStore();
  const [contract, setContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchContract() {
      try {
        const data = await getContract(id);
        setContract(data);
      } catch (error) {
        console.error("Error fetching contract:", error);
        toast("Failed to load contract details");
      } finally {
        setIsLoading(false);
      }
    }

    fetchContract();
  }, [id, getContract]);

  const handleDelete = async () => {
    if (!contract) return;

    setIsDeleting(true);
    try {
      await deleteContract(contract.id);
      toast("The contract has been successfully deleted");
      router.push("/contracts");
    } catch (error) {
      console.error("Error deleting contract:", error);
      toast("Failed to delete the contract");
      setIsDeleting(false);
    }
  };

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
          The contract you are looking for does not exist or has been deleted.
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/contracts">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Contracts
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">
            {contract.title}
          </h2>
          <p className="text-muted-foreground mt-1">
            Contract ID: {contract.id}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/contracts/${contract.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Contract</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this contract? This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Contract Details</CardTitle>
              <CardDescription>Information about this contract</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Client</h3>
                <p>{contract.client}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Status</h3>
                <Badge
                  variant={
                    contract.status === "Finalized" ? "default" : "outline"
                  }
                >
                  {contract.status}
                </Badge>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Created</h3>
                <p className="text-sm text-muted-foreground">
                  {contract.createdAt ? formatDate(contract.createdAt) : "N/A"}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-1">Last Updated</h3>
                <p className="text-sm text-muted-foreground">
                  {contract.updatedAt ? formatDate(contract.updatedAt) : "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Contract Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap rounded-md border bg-muted p-4 font-mono">
                {(() => {
                  try {
                    const parsedData = JSON.parse(contract.data);

                    return JSON.stringify(parsedData, null, 2);
                  } catch {
                    return contract.data;
                  }
                })()}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
