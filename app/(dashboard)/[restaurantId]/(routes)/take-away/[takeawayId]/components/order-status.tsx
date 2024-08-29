"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action"; 

export type OrderColumn = {
  id: string;
  amount: number;
  orderItems: string;
  createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "orderItems",
    header: "Menu Items",
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "amount",
    header: "Total amount",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
