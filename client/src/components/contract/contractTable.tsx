"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useContractStore } from "@/store/contractStore";
import { ContractStatus } from "@/types/types";
import { formatDate, truncateText } from "@/utils/format";
import { generatePagination } from "@/utils/pagination";

export function ContractTable() {
  const router = useRouter();
  const { contracts, total, isLoading, filters, setFilters, fetchContracts } =
    useContractStore();

  const totalPages = Math.ceil(total / 10);
  const currentPage = filters.page || 1;
  const paginationItems = generatePagination(currentPage, totalPages);

  const getStatusBadge = (status: ContractStatus) => {
    switch (status) {
      case "Draft":
        return <Badge variant="outline">Draft</Badge>;
      case "Finalized":
        return <Badge variant="default">Finalized</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handlePageChange = (page: number) => {
    setFilters({ page });
    fetchContracts();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Contracts</CardTitle>
          <CardDescription>
            {total === 0
              ? "No contracts found"
              : `Showing ${contracts.length} of ${total} total contract${total !== 1 ? "s" : ""}`}
          </CardDescription>
        </div>
        <Button asChild>
          <Link href="/contracts/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Contract
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : contracts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">No contracts found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try changing your filters or create a new contract
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right pr-10">
                      Last Updated
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contracts.map((contract) => (
                    <TableRow
                      key={contract.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => router.push(`/contracts/${contract.id}`)}
                    >
                      <TableCell>{truncateText(contract.client, 20)}</TableCell>
                      <TableCell>{truncateText(contract.title, 30)}</TableCell>
                      <TableCell>{getStatusBadge(contract.status)}</TableCell>
                      <TableCell className="text-right">
                        {contract.updatedAt
                          ? formatDate(contract.updatedAt)
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-1 mt-8">
                {paginationItems.map((item, i) =>
                  typeof item === "number" ? (
                    <Button
                      key={i}
                      variant={item === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(item)}
                    >
                      {item}
                    </Button>
                  ) : (
                    <Button key={i} variant="outline" size="sm" disabled>
                      {item}
                    </Button>
                  ),
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
