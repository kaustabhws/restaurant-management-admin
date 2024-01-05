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
    <div className="min-h-screen flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-3xl">
            {restaurant?.name}
          </CardTitle>
        </CardHeader>
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle>Order #{order?.slNo}</CardTitle>
            <CardTitle className="text-lg">
              {order?.isPaid ? 
              (<div className='flex items-center gap-2'>
                Paid <CheckCheck color="green" />
              </div>) 
              : 
              (<div className='flex items-center gap-2'>
                Not paid <X color="red" />
              </div>)}
            </CardTitle>
          </div>
          <CardDescription>
            Detailed bill for order #{order?.slNo}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Table>
                  <TableCaption>Invoice for order #{order?.slNo}</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Item name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Total Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order?.bill.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <p>{item.itemName}</p>
                        </TableCell>
                        <TableCell>
                          <p>{item.totalPrice / item.quantity}</p>
                        </TableCell>
                        <TableCell className="text-right">
                          <p>{item.quantity}</p>
                        </TableCell>
                        <TableCell className="text-right">
                          <p>{item.totalPrice}</p>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={2}>Total</TableCell>
                      <TableCell className="text-right">
                        {totalQuantity}
                      </TableCell>
                      <TableCell className="text-right">
                        {order?.amount}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </div>
          </form>
        </CardContent>
        <BillClient resId={restaurant?.id} orderId={order?.id} paid={order?.isPaid} />
      </Card>
    </div>
  );
};

export default CardWithForm;
