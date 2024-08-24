import prismadb from "@/lib/prismadb";
import { BillClient } from "./components/client";
<<<<<<< HEAD
import { CheckCheck, X } from "lucide-react";
=======
>>>>>>> 0166eda0a40faab816c4eeebea29ed6c5f85d82f
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
<<<<<<< HEAD
    <div className="min-h-screen flex items-center justify-center flex-col">
=======
    <div className="min-h-screen flex items-center justify-center flex-col-reverse">
>>>>>>> 0166eda0a40faab816c4eeebea29ed6c5f85d82f
      <BillContent restaurant={restaurant} order={order} />
    </div>
  );
};

export default CardWithForm;
