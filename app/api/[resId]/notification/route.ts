import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { resId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { type } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    // mark all as read
    if (type === "read") {
      await prismadb.notification.updateMany({
        where: {
          resId: params.resId,
          status: "Unread",
        },
        data: {
          status: "Read",
        },
      });

      return NextResponse.json({ message: "Marked as read" });
    }

    if (type === "remove") {
      await prismadb.notification.deleteMany({
        where: {
          resId: params.resId,
        },
      });

      return NextResponse.json({ message: "Removed all" });
    }
  } catch (error) {
    console.log("[NOTIFICATION_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
