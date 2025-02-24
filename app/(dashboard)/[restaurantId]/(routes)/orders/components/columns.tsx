"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import BillAction from "./bill-action";

export type OrderColumn = {
  id: string;
  slNo: string;
  isPaid: boolean;
  tableNo: string;
  status: string;
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
    cell: ({ row }) => (
      <span>{!row.original.tableNo ? "N/A" : row.original.tableNo}</span>
    ),
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 whitespace-nowrap text-xs font-semibold ${
          row.original.status === "Fulfilled"
            ? "bg-green-600"
            : row.original.status === "Ordered"
            ? "bg-yellow-600"
            : "bg-red-600"
        }`}
      >
        {row.original.status}
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
