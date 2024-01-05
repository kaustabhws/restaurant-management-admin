"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import BillAction from "./bill-action";

export type OrderColumn = {
  id: string;
  slNo: Number,
  isPaid: boolean;
  amount: Number;
  menuItems: string;
  createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "slNo",
    header: "ID",
  },
  {
    accessorKey: "menuItems",
    header: "Ordered Items",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
  {
    id: "bill",
    cell: ({ row }) => <BillAction data={row.original} />
  }
];
