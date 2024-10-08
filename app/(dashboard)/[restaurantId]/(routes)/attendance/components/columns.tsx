import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type EmployeeAttendanceColumn = {
  id: string;
  empId: string;
  name: string;
  jobTitle: string;
  status: string;
  daysPresent: number;
  daysAbsent: number;
  createdAt: string;
};

export const columns: ColumnDef<EmployeeAttendanceColumn>[] = [
  {
    accessorKey: "empId",
    header: "Employee ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "jobTitle",
    header: "Job Title",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 text-xs font-semibold text-white ${
          row.original.status === "Present"
            ? "bg-green-500"
            : row.original.status === "Leave"
            ? "bg-transparent border"
            : "bg-red-500"
        }
         rounded-full`}
      >
        {row.original.status}
      </span>
    ),
  },
  {
    accessorKey: "daysPresent",
    header: "Days Present",
  },
  {
    accessorKey: "daysAbsent",
    header: "Days Absent",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
