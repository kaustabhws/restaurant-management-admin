"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action";

export type MenuColumn = {
  id: string;
  name: string;
  price: number;
  createdAt: string;
}

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
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />
  }
];