import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { resId: string; itemId: string } }
) {
  try {
    const userId = auth();
    const body = await req.json();
    const { status } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!status) {
      return new NextResponse("Bad Request", { status: 400 });
    }

    // Update the status of the item
    if (status === "Rejected") {
      await prismadb.kDSOrderItem.update({
        where: {
          id: params.itemId,
        },
        data: {
          status: "Rejected",
        },
      });
    }

    return NextResponse.json(
      { message: "Item updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("KDS_ITEM_PATCH_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
