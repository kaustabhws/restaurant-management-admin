import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prismadb from "@/lib/prismadb";
import { BillClient } from "./components/client";
import { CheckCheck, X } from "lucide-react";
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

  const totalQuantity = order?.bill
    .map((item) => item.quantity)
    .reduce((acc, quantity) => acc + quantity, 0);

  return (
    <div className="min-h-screen flex items-center justify-center flex-col">
      <BillContent restaurant={restaurant} order={order} />
    </div>
  );
};

export default CardWithForm;
