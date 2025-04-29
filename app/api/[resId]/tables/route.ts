import prismadb from "@/lib/prismadb";
import { hasPermission } from "@/utils/has-permissions";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { resId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, seats, status } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const hasAccess = await hasPermission(userId, "CreateTables");

    if (!hasAccess) {
      return new NextResponse("Insufficient Permissions", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!seats) {
      return new NextResponse("Seats is required", { status: 400 });
    }

    if (!status) {
      return new NextResponse("Status is required", { status: 400 });
    }

    if (!params.resId) {
      return new NextResponse("Restaurant id is required", { status: 400 });
    }

    const restaurantsByUserId = await prismadb.restaurants.findFirst({
      where: {
        OR: [
          { id: params.resId, userId },
          {
            id: params.resId,
            users: {
              some: {
                clerkId: userId,
                role: {
                  permissions: { some: { name: "CreateTables" } },
                },
              },
            },
          },
        ],
      },
    });

    if (!restaurantsByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const table = await prismadb.table.create({
      data: {
        name,
        seats,
        status,
        resId: params.resId,
      },
    });
    return NextResponse.json(table);
  } catch (error) {
    console.log("[TABLES_POST]", error);
    return new NextResponse("Internal Server error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { resId: string } }
) {
  try {
    if (!params.resId) {
      return new NextResponse("Restaurant id is required", { status: 400 });
    }

    const tables = await prismadb.table.findMany({
      where: {
        resId: params.resId,
      },
    });
    return NextResponse.json(tables);
  } catch (error) {
    console.log("[MENUS_POST]", error);
    return new NextResponse("Internal Server error", { status: 500 });
  }
}
