import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { format } from "date-fns";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { empId: string; resId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const {
      name,
      email,
      phone,
      address,
      startDate,
      jobTitle,
      shiftType,
      salary,
      bankDetails,
      schedules,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.empId) {
      return new NextResponse("Employee id is required", { status: 400 });
    }

    const restaurantByUserId = await prismadb.restaurants.findFirst({
      where: {
        id: params.resId,
        userId,
      },
    });

    if (!restaurantByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const emp = await prismadb.employee.findUnique({
      where: {
        id: params.empId,
      },
    });

    if (!emp) {
      return new NextResponse("Employee not found", { status: 404 });
    }

    // Update only provided fields for Employee
    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (startDate) updateData.startDate = startDate;
    if (jobTitle) updateData.jobTitle = jobTitle;
    if (shiftType) updateData.shiftType = shiftType;
    if (salary) updateData.salary = salary;

    if (Object.keys(updateData).length > 0) {
      await prismadb.employee.updateMany({
        where: { id: params.empId },
        data: updateData,
      });
    }

    // Update bank details if provided
    if (bankDetails) {
      const { bankName, accountNumber, ifscCode } = bankDetails;
      await prismadb.bankDetails.update({
        where: { employeeId: emp.id },
        data: {
          bankName: bankName ?? undefined,
          bankAccNo: accountNumber ?? undefined,
          bankIFSC: ifscCode ?? undefined,
        },
      });
    }

    // Update schedules if provided
    if (schedules) {
      const { startTime, endTime, isDayOff } = schedules;
      await prismadb.schedules.update({
        where: { employeeId: emp.id },
        data: {
          startTime: startTime ?? undefined,
          endTime: endTime ?? undefined,
          isDayoff: isDayOff ?? undefined,
        },
      });

      if (isDayOff) {
        await prismadb.employeeAttendance.update({
          where: {
            employeeId_date: {
              employeeId: params.empId,
              date: format(new Date(), "dd-MM-yyyy"),
            },
          },
          data: {
            status: "Leave",
          },
        });
      } else {
        await prismadb.employeeAttendance.update({
          where: {
            employeeId_date: {
              employeeId: params.empId,
              date: format(new Date(), "dd-MM-yyyy"),
            },
          },
          data: {
            status: "Absent",
          },
        });
      }
    }

    return NextResponse.json({ message: "Employee updated successfully" });
  } catch (error) {
    console.log("[EMPLOYEE_PATCH]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { empId: string; resId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.empId) {
      return new NextResponse("Employee id is required", { status: 400 });
    }

    const restaurantByUserId = await prismadb.restaurants.findFirst({
      where: {
        id: params.resId,
        userId,
      },
    });

    if (!restaurantByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    await prismadb.bankDetails.deleteMany({
      where: {
        employeeId: params.empId,
      },
    });

    await prismadb.schedules.deleteMany({
      where: {
        employeeId: params.empId,
      },
    });

    await prismadb.employeeAttendance.deleteMany({
      where: {
        employeeId: params.empId,
      },
    });

    const employee = await prismadb.employee.delete({
      where: {
        id: params.empId,
      },
    });

    return NextResponse.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.log("[EMPLOYEE_DELETE]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { empId: string } }
) {
  try {
    const employee = await prismadb.employee.findUnique({
      where: {
        id: params.empId,
      },
    });

    return NextResponse.json(employee);
  } catch (error) {
    console.log("[EMPLOYEE_GET]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
