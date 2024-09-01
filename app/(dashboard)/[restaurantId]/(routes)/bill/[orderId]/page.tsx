import prismadb from "@/lib/prismadb";
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

  const customer = await prismadb.customer.findUnique({
    where: {
      id: order?.customerId || "",
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <BillContent restaurant={restaurant} order={order} customer={customer} />
    </div>
  );
};

export default CardWithForm;
