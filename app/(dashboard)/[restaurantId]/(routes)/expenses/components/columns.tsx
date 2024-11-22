"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type ExpenseColumn = {
  id: string;
  category: string;
  amount: string;
  description: string;
  createdAt: string;
};

export const columns: ColumnDef<ExpenseColumn>[] = [
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
];
