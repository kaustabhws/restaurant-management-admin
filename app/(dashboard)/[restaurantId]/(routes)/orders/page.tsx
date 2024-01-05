import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { OrderColumn } from "./components/columns";
import { OrderClient } from "./components/client";

const OrdersPage = async ({ params }: { params: { restaurantId: string } }) => {
  const orders = await prismadb.orders.findMany({
    where: {
      resId: params.restaurantId,
    },
    include: {
      orderItems: {
        include: {
          menuItem: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    slNo: item.slNo,
    menuItems: item.orderItems
      .map((orderItem) => orderItem.menuItem.name)
      .join(", "),
    amount: item.amount,
    isPaid: item.isPaid,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
