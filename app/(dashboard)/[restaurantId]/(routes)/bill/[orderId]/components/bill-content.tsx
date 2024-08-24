"use client";

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
import { CheckCheck, PrinterIcon, X } from "lucide-react";
import { BillClient } from "./client";
import { Button } from "@/components/ui/button";

import { useReactToPrint } from "react-to-print";
import { useRef } from "react";

interface Restaurant {
  id: string;
  name: string;
}

interface BillItem {
  id: string;
  orderId: string;
  itemName: string;
  itemId: string;
  totalPrice: number;
  quantity: number;
}

interface Order {
  id: string;
  slNo: string;
  resId: string;
  tableNo: string;
  amount: number;
  isPaid: boolean;
  bill: BillItem[];
}

interface BillContentProps {
  restaurant?: Restaurant | null;
  order?: Order | null;
}

const BillContent: React.FC<BillContentProps> = ({ restaurant, order }) => {
  const totalQuantity = order?.bill
    .map((item) => item.quantity)
    .reduce((acc, quantity) => acc + quantity, 0);

  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
        @page {
            size: 80mm 297mm;
        }
        @media print {
            header, footer {
                display: none;
            }
        }
    `,
  });

  return (
    <div>
      <div className="flex gap-3 justify-center">
        <BillClient
          resId={restaurant?.id}
          orderId={order?.id}
          paid={order?.isPaid}
        />
        <Button onClick={handlePrint}>
          <PrinterIcon className="mr-2 h-4 w-4" />
          Print
        </Button>
      </div>
      <Card ref={componentRef}>
        <CardHeader>
          <CardTitle className="text-center text-3xl">
            {restaurant?.name}
          </CardTitle>
        </CardHeader>
        <CardHeader>
          <div className="flex justify-between">
            <div className="flex flex-col text-muted-foreground">
              <CardTitle className="text-base">Order: #{order?.slNo}</CardTitle>
              <CardTitle className="text-base">
                Table No: {order?.tableNo}
              </CardTitle>
            </div>
            <CardTitle className="text-lg">
              {order?.isPaid ? (
                <div className="flex items-center gap-2">
                  Paid <CheckCheck color="green" />
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Not paid <X color="red" />
                </div>
              )}
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
                        <TableCell className="text-right">
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
      </Card>
    </div>
  );
};

export default BillContent;
