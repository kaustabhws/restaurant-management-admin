import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { EmployeeClient } from "./components/client";
import { EmployeeColumn } from "./components/columns";

const EmployeesPage = async ({
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
  });

  const formattedMenu: EmployeeColumn[] = employees.map((item) => ({
    id: item.id,
    empId: item.empId,
    name: item.name,
    phone: item.phone,
    jobTitle: item.jobTitle,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6 max-[425px]:px-3">
        <EmployeeClient data={formattedMenu} />
      </div>
    </div>
  );
};

export default EmployeesPage;
