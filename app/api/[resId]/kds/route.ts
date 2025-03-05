import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { resId: string } }
) {
  const { userId } = auth();
  const body = await req.json();
  const { kdsId, accept, reject, orderSlNo } = body;

  try {
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!params.resId) {
      return new NextResponse("Restaurant id is required", { status: 400 });
    }

    if (!kdsId) {
      return new NextResponse("KDS id is required", { status: 400 });
    }

    if (accept && !reject) {
      await prismadb.kDSOrder.update({
        where: {
          resId: params.resId,
          id: kdsId,
        },
        data: {
          accepted: true,
          items: {
            updateMany: {
              where: {
                kdsOrderId: kdsId,
              },
              data: {
                status: "Preparing",
              },
            },
          },
        },
      });
      return new NextResponse("Order accepted", { status: 200 });
    } else if (reject && !accept) {
      await prismadb.kDSOrder.update({
        where: {
          resId: params.resId,
          id: kdsId,
        },
        data: {
          accepted: false,
          status: "Rejected",
          items: {
            updateMany: {
              where: {
                kdsOrderId: kdsId,
              },
              data: {
                status: "Rejected",
              },
            },
          },
        },
      });

      await prismadb.orders.update({
        where: {
          resId: params.resId,
          slNo: orderSlNo,
        },
        data: {
          status: "Rejected",
        }
      })

      return new NextResponse("Order rejected", { status: 200 });
    }
  } catch (error) {
    console.log("[KDS_POST_ERROR]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { resId: string } }
) {
  const { userId } = auth();
  const body = await req.json();
  const { markAsDone, kdsId, orderSlNo } = body;

  try {
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!params.resId) {
      return new NextResponse("Restaurant id is required", { status: 400 });
    }
    if (!markAsDone) {
      return new NextResponse("KDS id is required", { status: 400 });
    }

    const updateKdsOrder = await prismadb.kDSOrder.update({
      where: {
        resId: params.resId,
        id: kdsId,
      },
      data: {
        accepted: true,
        status: "Ready",
        items: {
          updateMany: {
            where: {
              kdsOrderId: kdsId,
              status: "Preparing",
            },
            data: {
              status: "Ready",
            },
          },
        },
      },
    });

    return new NextResponse("Order marked as done", { status: 200 });
  } catch (error) {
    console.log("[KDS_PATCH_ERROR]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { resId: string } }
) {
  const { searchParams } = new URL(req.url);
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    const orderState = searchParams.get("state");

    if (orderState == "pending") {
      const kdsOrders = await prismadb.kDSOrder.findMany({
        where: {
          resId: params.resId,
          accepted: null,
          status: "Pending",
        },
        include: {
          items: true,
        },
      });

      return NextResponse.json(kdsOrders);
    } else if (orderState == "accepted") {
      const kdsOrders = await prismadb.kDSOrder.findMany({
        where: {
          resId: params.resId,
          accepted: true,
          status: "Pending",
        },
        include: {
          items: true,
        },
      });

      return NextResponse.json(kdsOrders);
    } else if (orderState == "fulfilled") {
      const kdsOrders = await prismadb.kDSOrder.findMany({
        where: {
          resId: params.resId,
          accepted: true,
          status: "Ready",
        },
        include: {
          items: true,
        },
      });

      return NextResponse.json(kdsOrders);
    }

    return new NextResponse("No orders found/invalid state", { status: 404 });
  } catch (error) {
    console.log("[KDS_GET_ERROR]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
