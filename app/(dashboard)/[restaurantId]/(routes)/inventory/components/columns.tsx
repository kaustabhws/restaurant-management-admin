"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Currency } from "@prisma/client";

export type InventoryColumn = {
  id: string;
  name: string;
  createdAt: string;
  status: string;
  availableQuantity: string;
  unit: string;
  minStockThreshold: number;
  price: string;
  currency: Currency;
  lastRestockedAt: string | null;
};

export const columns: ColumnDef<InventoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "availableQuantity",
    header: "Available Quantity",
  },
  {
    accessorKey: "price",
    header: "Price/Unit",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 whitespace-nowrap text-xs font-semibold ${
            row.original.status === "In Stock" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {row.original.status}
        </span>
      );
    },
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
