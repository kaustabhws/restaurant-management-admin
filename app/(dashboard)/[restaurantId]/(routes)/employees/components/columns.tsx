import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type EmployeeColumn = {
  id: string;
  empId: string;
  name: string;
  phone: string;
  jobTitle: string;
  createdAt: string;
};

export const columns: ColumnDef<EmployeeColumn>[] = [
  {
    accessorKey: "empId",
    header: "Employee ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "jobTitle",
    header: "Job Title",
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
