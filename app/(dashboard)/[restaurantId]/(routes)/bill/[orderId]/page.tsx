import prismadb from "@/lib/prismadb";
import BillContent from "./components/bill-content";
import { redirect } from "next/navigation";

const CardWithForm = async ({
  params,
}: {
  params: { orderId: string; restaurantId: string };
}) => {
  const order = await prismadb.orders.findUnique({
    where: {
      id: params.orderId,
    },
    include: {
      orderItems: true,
      bill: true,
    },
  });

  if (!order) {
    redirect(`/${params.restaurantId}/orders`);
  }

  const restaurant = await prismadb.restaurants.findUnique({
    where: {
      id: order.resId,
    },
  });

  if (!restaurant) {
    redirect(`/${params.restaurantId}/orders`);
  }

  const customer = await prismadb.customer.findUnique({
    where: {
      id: order.customerId || "",
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <BillContent restaurant={restaurant} order={order} customer={customer} />
    </div>
  );
};

export default CardWithForm;
