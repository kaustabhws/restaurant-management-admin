"use client";

import { TransactionColumn, columns } from "./loyalty-columns";
import { DataTable } from "@/components/ui/data-table";

interface TransactionClientProps {
  data: TransactionColumn[];
}

export const TransactionClient: React.FC<TransactionClientProps> = ({
  data,
}) => {
  return (
    <>
      <DataTable columns={columns} data={data} searchKey="description" />
    </>
  );
};
