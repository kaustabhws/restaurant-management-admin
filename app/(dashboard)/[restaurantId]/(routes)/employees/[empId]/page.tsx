import prismadb from "@/lib/prismadb";
import { EmployeeForm } from "./components/employee-form";

const MenuPage = async ({ params }: { params: { empId: string } }) => {
  const employee = await prismadb.employee.findUnique({
    where: {
      id: params.empId,
    },
    include: {
      bankDetails: true,
      schedules: true,
    }
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-4">
        <EmployeeForm initialData={employee} />
      </div>
    </div>
  );
};

export default MenuPage;
