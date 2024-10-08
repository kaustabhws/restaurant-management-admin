import prismadb from "@/lib/prismadb";
import { EmployeeAttendanceClient } from "./components/client";
import { EmployeeAttendanceColumn } from "./components/columns";
import { format } from "date-fns";

const EmployeeAttendancePage = async ({
  params,
}: {
  params: { restaurantId: string };
}) => {
  const employees = await prismadb.employee.findMany({
    where: {
      resId: params.restaurantId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      payroll: true,
      attendance: {
        orderBy: {
          date: "desc",
        },
      },
      schedules: true,
    },
  });

  const formattedAttendance: EmployeeAttendanceColumn[] = employees.map((item) => {
    
    const todayAttendance = item.attendance.find(item => item.date === format(new Date(), "dd-MM-yyyy"));

    // Count the number of days present and absent
    const daysPresent = item.attendance.filter((att) => att.status === "Present").length;
    const daysAbsent = item.attendance.filter((att) => att.status === "Absent").length;

    return {
      id: item.id,
      empId: item.empId,
      name: item.name,
      status: todayAttendance ? todayAttendance.status : "Absent", // Default to "Absent" if no attendance record
      jobTitle: item.jobTitle,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
      daysPresent: daysPresent, 
      daysAbsent: daysAbsent, 
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6 max-[425px]:px-3">
        <EmployeeAttendanceClient data={formattedAttendance} />
      </div>
    </div>
  );
};

export default EmployeeAttendancePage;
