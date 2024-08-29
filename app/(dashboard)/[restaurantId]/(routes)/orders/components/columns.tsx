"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import BillAction from "./bill-action";

export type OrderColumn = {
  id: string;
  slNo: string;
  isPaid: boolean;
  tableNo: string;
  amount: Number;
  orderType: string;
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
    accessorKey: "orderType",
    header: "Order Type",
    cell: ({ row }) => (
      <span>
        {row.original.orderType === "DINE_IN" ? "Dine In" : "Take Away"}
      </span>
    ),
  },
  {
    accessorKey: "tableNo",
    header: "Table No",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
    cell: ({ row }) => (
      <span
        className={`font-bold ${
          row.original.isPaid ? "text-green-600" : "text-red-600"
        }`}
      >
        {row.original.isPaid ? "Paid" : "Not Paid"}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
  {
    id: "bill",
    cell: ({ row }) => <BillAction data={row.original} />,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
];
