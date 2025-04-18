import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { OrderColumn } from "./components/columns";
import { OrderClient } from "./components/client";
import { getISTTime } from "@/lib/getISTTime";

const OrdersPage = async ({ params }: { params: { restaurantId: string } }) => {
  const orders = await prismadb.orders.findMany({
    where: {
      resId: params.restaurantId,
      // createdAt: {
      //   gte: new Date(new Date().setHours(0, 0, 0, 0)),
      //   lte: new Date(new Date().setHours(23, 59, 59, 999)),
      // }
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
    slNo: `#${item.slNo}`,
    menuItems: item.orderItems
      .map((orderItem) => orderItem.menuItem.name)
      .join(", "),
    orderType: item.orderType,
    amount: item.amount,
    isPaid: item.isPaid,
    status: item.status,
    tableNo: item.tableNo ?? '',
    createdAt: format(getISTTime(item.createdAt), 'MMMM do yyyy'),
    date: item.createdAt.toISOString(),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6 max-[425px]:px-3">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
