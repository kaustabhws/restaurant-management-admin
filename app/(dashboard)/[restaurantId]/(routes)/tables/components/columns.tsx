"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action";

export type TableColumn = {
  id: string;
  name: string;
  seats: number;
  status: string;
  createdAt: string;
}

export const columns: ColumnDef<TableColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "seats",
    header: "Seats",
  },
  {
    accessorKey: "status",
    header: "Status",
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