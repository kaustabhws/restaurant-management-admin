import prismadb from "@/lib/prismadb";
import { BillClient } from "./components/client";
import BillContent from "./components/bill-content";

const CardWithForm = async ({ params }: { params: { orderId: string } }) => {
  const order = await prismadb.orders.findUnique({
    where: {
      id: params.orderId,
    },
    include: {
      orderItems: true,
      bill: true,
    },
  });

  const restaurant = await prismadb.restaurants.findUnique({
    where: {
      id: order?.resId,
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center flex-col-reverse">
      <BillContent restaurant={restaurant} order={order} />
    </div>
  );
};

export default CardWithForm;
