import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type CustomerColumn = {
  id: string;
  contact: string;
  loyaltyPoints: number;
  totalSpent: number;
  createdAt: string;
};

export const columns: ColumnDef<CustomerColumn>[] = [
  {
    accessorKey: "contact",
    header: "Contact",
  },
  {
    accessorKey: "loyaltyPoints",
    header: "Loyalty Points",
  },
  {
    accessorKey: "totalSpent",
    header: "Total Spent",
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
