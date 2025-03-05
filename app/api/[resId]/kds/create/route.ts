import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { OrderType } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { resId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { selectedRows, tableId } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!selectedRows) {
      return new NextResponse("Order data is required", { status: 400 });
    }

    const tableName = await prismadb.table.findFirst({
      where: {
        id: tableId || "",
      },
    });

    const orderType = tableName ? "DINE_IN" : "TAKE_AWAY";

    // create kds order
    const kds = await prismadb.kDSOrder.create({
      data: {
        resId: params.resId,
        tableNo: tableName ? tableName.name : null,
        orderType: orderType as OrderType,
        items: {
          create: selectedRows.map((item: any) => ({
            itemName: item.orderItems,
            menuItemId: item.id,
            quantity: item.quantity[0],
          })),
        },
      },
    });

    // update sent to kitchen
    await prismadb.tempOrderItems.updateMany({
      where: {
        orderId: {
          in: selectedRows.map((item: any) => item.id),
        },
      },
      data: {
        status: "Sent",
      },
    });

    return NextResponse.json(tableId);
  } catch (error) {
    console.log("[KDS_CREATE_POST_ERROR]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
