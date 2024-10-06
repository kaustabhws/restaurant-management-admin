import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

function generateEmployeeId(name: string, startDate: Date): string {
  // Get the first four characters of the name
  const namePart = name.slice(0, 4).toUpperCase();

  // Extract the year from the start date
  const yearPart = startDate.getFullYear().toString();

  // Generate four random characters (letters and numbers)
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();

  // Combine parts to create the employee ID
  return `${namePart}${yearPart}${randomChars}`;
}

export async function POST(
    req: Request,
    { params }: { params: { resId: string } }
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
        return new NextResponse("Unauthorized", { status: 403 });
      }
  
      console.log(body);
  
      // Convert startDate to Date object
      const parsedStartDate = new Date(startDate);
  
      // Check for valid date
      if (isNaN(parsedStartDate.getTime())) {
        return new NextResponse("Invalid start date", { status: 400 });
      }
  
      // Validate required fields
      if (
        !name ||
        !email ||
        !phone ||
        !address ||
        !startDate ||
        !jobTitle ||
        !shiftType ||
        !salary ||
        !bankDetails ||
        !schedules
      ) {
        return new NextResponse("Invalid data", { status: 400 });
      }
  
      const restaurantsByUserId = await prismadb.restaurants.findFirst({
        where: {
          id: params.resId,
          userId,
        },
      });
  
      if (!restaurantsByUserId) {
        return new NextResponse("Unauthorized", { status: 403 });
      }
  
      const employee = await prismadb.employee.create({
        data: {
          empId: generateEmployeeId(name, parsedStartDate), // Keep using Date for ID generation
          name,
          email,
          phone,
          address,
          startDate: parsedStartDate.toISOString(), // Convert back to string
          jobTitle,
          shiftType,
          salary,
          resId: params.resId,
        },
      });
  
      if (employee) {
        await prismadb.bankDetails.create({
          data: {
            employeeId: employee.id,
            bankName: bankDetails.bankName,
            bankAccNo: bankDetails.accountNumber,
            bankIFSC: bankDetails.ifscCode,
          },
        });
  
        await prismadb.schedules.create({
          data: {
            employeeId: employee.id,
            startTime: schedules.startTime,
            endTime: schedules.endTime,
            isDayoff: schedules.isDayOff,
          },
        });
      }
  
      return NextResponse.json(employee);
    } catch (error) {
      console.log("[EMPLOYEE_POST]", error);
      return new NextResponse("Internal Server error", { status: 500 });
    }
  }
  