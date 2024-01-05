import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: { resId: string, tempId: string } }
  ) {
    try {
      const { userId } = auth();
  
      if (!userId) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      if (!params.resId) {
        return new NextResponse("Restaurant id id is required", { status: 400 });
      }

      if(!params.tempId) {
        return new NextResponse("Temp order id id is required", { status: 400 });
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
  
      const deleteTempOrderItems = await prismadb.tempOrderItems.deleteMany({
        where: {
          orderId: params.tempId,
        },
      });

      const deleteTempOrder = await prismadb.tempOrders.delete({
        where: {
          id: params.tempId,
        },
      });

  
      return NextResponse.json(deleteTempOrder);
    } catch (error) {
      console.log("[Menu_DELETE]", error);
      return new NextResponse("Internal server error", { status: 500 });
    }
  }