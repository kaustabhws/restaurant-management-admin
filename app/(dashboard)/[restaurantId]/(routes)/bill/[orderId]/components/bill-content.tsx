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
import { useRef, useState } from "react";
import LoyaltyPayment from "@/components/loyalty-payment";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";

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
  tableNo: string | null;
  payMode: string;
  orderType: string;
  discount: number;
  discountType: "Percentage" | "Coupon" | null;
  amount: number;
  isPaid: boolean;
  bill: BillItem[];
}

interface Customer {
  id: string;
  email: string | null;
  phone: string | null;
  loyaltyPoints: number;
  totalSpent: number;
}

interface BillContentProps {
  restaurant?: Restaurant | null;
  order?: Order | null;
  customer?: Customer | null;
  loyaltyPoints?: number | undefined;
}

const BillContent: React.FC<BillContentProps> = ({
  restaurant,
  order,
  customer,
}) => {
  const totalQuantity = order?.bill
    .map((item) => item.quantity)
    .reduce((acc, quantity) => acc + quantity, 0);

  const [discountPercentage, setDiscountPercentage] = useState<number>();
  const [coupon, setCoupon] = useState<string>();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
        @page {
            size: 80mm 297mm;
        }
        @media print {
            header, footer {
                display: none !important;
            }
        }
    `,
  });

  const applyDiscount = async () => {
    if (!discountPercentage) {
      return;
    }
    const discount = (order?.amount! * discountPercentage) / 100;

    try {
      setLoading(true);
      await axios.patch(`/api/${restaurant?.id}/order/${order?.id}`, {
        discount: discount,
        discountType: "Percentage",
      });
      toast.success("Discount applied successfully");
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data === "Discount already applied") {
          toast.error("Discount already applied");
          return;
        }
      }
      toast.error("Failed to apply discount");
    } finally {
      setLoading(false);
    }
  };

  const applyCoupon = async () => {
    try {
      setLoading(true);
      await axios.patch(`/api/${restaurant?.id}/order/${order?.id}`, {
        coupon,
        discountType: "Coupon",
      });
      toast.success("Coupon applied successfully");
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data === "Coupon already applied") {
          toast.error("Coupon already applied");
          return;
        }
      }
      toast.error("Failed to apply coupon");
    } finally {
      setLoading(false);
    }
  };

  const removeDiscount = async () => {
    try {
      setLoading(true);
      await axios.patch(`/api/${restaurant?.id}/order/${order?.id}`, {
        removeDiscount: true,
      });
      toast.success("Discount removed successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to remove discount");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="my-3">
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
        <div className="flex items-center justify-center space-x-2">
          {order?.discount! > 0 && order?.discountType === "Percentage" ? (
            // Show remove discount button if a discount is applied
            <Button
              variant="outline"
              onClick={removeDiscount}
            >
              Remove Discount
            </Button>
          ) : order?.discount! > 0 && order?.discountType === "Coupon" ? (
            <></>
          ) : (
            <>
              {/* Discount Input & Apply Button */}
              <div className="flex-1">
                <Label htmlFor="discount">Discount (%)</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    id="discount"
                    placeholder="5%"
                    className="w-24"
                    value={discountPercentage}
                    onChange={(e) =>
                      setDiscountPercentage(Number(e.target.value))
                    }
                    min="0"
                    max="100"
                  />
                  <Button
                    disabled={loading}
                    variant="outline"
                    onClick={applyDiscount}
                  >
                    Apply
                  </Button>
                </div>
              </div>

              {/* Coupon Input & Apply Button */}
              <div className="flex-1">
                <Label htmlFor="coupon">Coupon/Gift Card</Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    id="coupon"
                    placeholder="GIFT-77B373BV-28BU"
                    className="w-24"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                  />
                  <Button
                    disabled={loading}
                    variant="outline"
                    onClick={applyCoupon}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <Card ref={componentRef}>
        <CardHeader>
          <CardTitle className="text-center text-3xl">
            {restaurant?.name}
          </CardTitle>
        </CardHeader>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex flex-col text-muted-foreground">
              <CardTitle className="text-base">Order: #{order?.slNo}</CardTitle>
              <CardTitle className="text-base">
                {order?.tableNo && `Table No: ${order?.tableNo}`}
              </CardTitle>
              <p className="text-muted-foreground text-sm">
                {order?.orderType === "DINE_IN"
                  ? "Dine In Order"
                  : "Take Away Order"}
              </p>
            </div>
            <CardTitle className="text-lg">
              {order?.isPaid ? (
                <div
                  className="flex items-center gap-2"
                  style={{ color: "green" }}
                >
                  Paid <CheckCheck color="green" />
                </div>
              ) : (
                <div
                  className="flex items-center gap-2"
                  style={{ color: "red" }}
                >
                  Not paid <X color="red" />
                </div>
              )}
              {order?.payMode && (
                <p className="text-xs text-muted-foreground capitalize">
                  Via {order?.payMode}
                </p>
              )}
            </CardTitle>
          </div>
          <CardDescription>
            Detailed bill for order #{order?.slNo}
          </CardDescription>
        </CardHeader>
        <CardContent className="max-[440px]:px-2">
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
                    {(order?.discount ?? 0) > 0 && (
                      <TableRow>
                        <TableCell colSpan={3}>Discount {order?.discountType === 'Coupon' && <p>(Coupon)</p>}</TableCell>
                        <TableCell className="text-right">
                          {order?.discount}
                        </TableCell>
                      </TableRow>
                    )}
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
      <div className="my-4">
        {customer && order && (
          <LoyaltyPayment customer={customer} order={order} />
        )}
      </div>
    </div>
  );
};

export default BillContent;
