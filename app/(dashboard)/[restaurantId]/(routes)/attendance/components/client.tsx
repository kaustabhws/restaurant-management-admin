"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { EmployeeAttendanceColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { format } from "date-fns";

interface EmployeeAttendanceClientProps {
  data: EmployeeAttendanceColumn[];
}

export const EmployeeAttendanceClient: React.FC<
  EmployeeAttendanceClientProps
> = ({ data }) => {
  const presentEmployeesCount = data.filter(
    (employee) => employee.status === "Present"
  ).length;

  const filterOptions = {
    key: "status",
    options: [
      { label: "Present", value: "Present" },
      { label: "Absent", value: "Absent" },
      { label: "Leave", value: "Leave" },
    ],
  };
  return (
    <>
      <div className="flex flex-col justify-between gap-4">
        <Heading
          title={`Attendance (${presentEmployeesCount} Present)`}
          description="Manage attendance for employees"
        />
        <div>
          <p className="text-sm">
            Today&apos;s Date:{" "}
            <span className="font-medium text-lg">
              {format(new Date(), "MMMM do, yyyy")}{" "}
            </span>
          </p>
        </div>
      </div>
      <Separator />
      <DataTable
        columns={columns}
        data={data}
        searchKey="name"
        filterOptions={filterOptions}
      />
    </>
  );
};
