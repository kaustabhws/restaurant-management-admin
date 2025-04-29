import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { resId: string; memberId: string } }
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

    if (!params.memberId) {
      return new NextResponse("Member ID is required", { status: 400 });
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

    if (existingUser && existingUser.id !== params.memberId) {
      return new NextResponse("Email or phone already exists", { status: 400 });
    }

    // update the user with role and permissions
    const updatedUser = await prismadb.user.update({
      where: {
        id: params.memberId,
      },
      data: {
        name,
        email,
        phone,
        role: {
          update: {
            name: role,
            permissions: {
              deleteMany: {},
              create: permissions.map((permission: string) => ({
                name: permission,
              })),
            },
          },
        },
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.log("[ACCESS_CONTROL_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
