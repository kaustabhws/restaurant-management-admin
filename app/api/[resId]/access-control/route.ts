import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { resId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, email, phone, role, permissions } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name || !email || !role) {
      return new NextResponse("Name, email and role are required", {
        status: 400,
      });
    }

    if (!params.resId) {
      return new NextResponse("Restaurant ID is required", { status: 400 });
    }

    // Check if the user owns the restaurant
    const restaurant = await prismadb.restaurants.findFirst({
      where: {
        id: params.resId,
        userId,
      },
    });

    if (!restaurant) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // check if the email already exists in the database
    const existingUser = await prismadb.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      return new NextResponse("Email or phone already exists", { status: 400 });
    }

    // create roles and permission for the member
    const userRole = await prismadb.role.create({
      data: {
        name: role,
        permissions: {
          create: permissions.map((permission: string) => ({
            name: permission,
          })),
        },
      },
    });

    // Create the user in the database
    const newUser = await prismadb.user.create({
      data: {
        name,
        email,
        phone,
        resId: params.resId,
        roleId: userRole.id,
      },
    });

    return NextResponse.json({ newUser }, { status: 200 });
  } catch (error) {
    console.log("[ACCESS_CONTROL_POST_ERROR]", error);
    return new NextResponse("Internal Server error", { status: 500 });
  }
}
