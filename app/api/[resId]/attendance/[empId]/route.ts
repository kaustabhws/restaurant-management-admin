import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { format } from "date-fns";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { empId: string; resId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { hours, status } = body;

    // check for null values
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.empId) {
      return new NextResponse("Employee id is required", { status: 400 });
    }

    if (!status) {
      return new NextResponse("Invalid data", { status: 400 });
    }

    // find restaurant id
    const restaurantByUserId = await prismadb.restaurants.findFirst({
      where: {
        id: params.resId,
        userId,
      },
    });

    if (!restaurantByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // find employee
    const emp = await prismadb.employee.findUnique({
      where: {
        id: params.empId,
      },
    });

    if (!emp) {
      return new NextResponse("Employee not found", { status: 404 });
    }

    // check if employee is already marked for today
    const isAvailable = await prismadb.employeeAttendance.findUnique({
      where: {
        employeeId_date: {
          employeeId: params.empId,
          date: format(new Date(), "dd-MM-yyyy"),
        },
      },
    });

    if (isAvailable) {
      if (isAvailable.status === "Present" && status === 'Absent' || status === 'Leave') {
        await prismadb.employeeAttendance.delete({
          where: {
            employeeId_date: {
              employeeId: params.empId,
              date: format(new Date(), "dd-MM-yyyy"),
            },
          },
        });

        await prismadb.employeeAttendance.create({
          data: {
            employeeId: params.empId,
            hoursToday: 0,
            status,
            date: format(new Date(), "dd-MM-yyyy"),
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
            hoursToday: hours,
            status,
          },
        });
      }
    } else {
      await prismadb.employeeAttendance.create({
        data: {
          employeeId: params.empId,
          hoursToday: hours,
          status,
          date: format(new Date(), "dd-MM-yyyy"),
        },
      });
    }

    return NextResponse.json({ message: "Employee updated successfully" });
  } catch (error) {
    console.log("[ATTENDANCE_POST]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
