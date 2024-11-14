import { ColumnDef } from "@tanstack/react-table";

export type TransactionColumn = {
  id: string;
  type: string;
  transaction: string;
  description: string;
  createdAt: string;
};

export const columns: ColumnDef<TransactionColumn>[] = [
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "transaction",
    header: "Loyalty Points",
    cell: ({ row }) => {
      const transactionAmount = row.original.transaction;
      const isEarned = transactionAmount.startsWith("+");
      const transactionColor = isEarned ? "text-green-500" : "text-red-500"; // Set color based on "+" or "-"

      return <span className={transactionColor}>{transactionAmount}</span>;
    },
  },
];
