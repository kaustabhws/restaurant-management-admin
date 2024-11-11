"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { ReactNode } from "react";
import { Star } from "lucide-react";

export type MenuColumn = {
  id: string;
  name: string;
  price: number;
  rating: string;
  status: string;
  createdAt: string;
};

export const columns: ColumnDef<MenuColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      return (
        <span>
          {row.original.rating === "N/A" ? (
            "N/A"
          ) : (
            <p className='flex items-center gap-1'>
              {row.original.rating}{" "}
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            </p>
          )}
        </span>
      );
    },
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
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
