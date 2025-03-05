import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { resId: string } }
) {
  try {
    const userId = auth();
    const body = await req.json();
    const { oldTableId, newTableId } = body;

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }
    if (!oldTableId || !newTableId) {
      return new Response("Bad Request", { status: 400 });
    }

    const tempOrders = await prismadb.tempOrders.findFirst({
      where: {
        resId: params.resId,
        tableId: oldTableId,
      },
    });

    if (!tempOrders) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // Perform the transfer operation here
    const transfer = await prismadb.tempOrders.update({
      where: {
        resId: params.resId,
        tableId: oldTableId,
        id: tempOrders.id,
      },
      data: {
        tableId: newTableId,
      },
    });

    if (transfer) {
      await prismadb.table.update({
        where: {
          id: oldTableId,
        },
        data: {
          status: "Available",
        },
      });
      await prismadb.table.update({
        where: {
          id: newTableId,
        },
        data: {
          status: "Occupied",
        },
      });
    }

    return NextResponse.json(transfer, { status: 200 });
  } catch (error) {
    console.log("TABLES_OVERVIEW_TRANSFER_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
