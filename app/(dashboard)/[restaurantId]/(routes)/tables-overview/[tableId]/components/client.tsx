"use client";

import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { columns, OrderColumn } from "./order-status";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface OrderClientProps {
  data: OrderColumn[];
  temporder: any;
  loading: boolean;
  setLoading: any;
}

export const OrderClient: React.FC<OrderClientProps> = ({
  data,
  temporder,
  loading,
  setLoading,
}) => {
  const params = useParams();
  const router = useRouter();

  const resultData = {
    resultData: {
      menuItems: temporder.flatMap((order: any) =>
        order.orderItems.map((item: any) => ({
          id: item.menuItem.id,
          orderId: item.orderId,
          name: item.menuItem.name,
          quantity: item.quantity,
          price: item.menuItem.price,
        }))
      ),
      tableId: temporder.some((order: any) => order.id)
        ? temporder[0].tableId
        : undefined,
      totalAmount: temporder.reduce(
        (sum: any, order: any) => sum + order.amount,
        0
      ),
    },
  };

  const submitOrder = async () => {
    try {
      setLoading(true);
      await axios.post(`/api/${params.restaurantId}/order`, resultData);
      router.refresh();
      toast.success("Food order submitted");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Foods ordered (${data.length})`}
          description="List of ordered foods"
        />
        <Button disabled={loading} type="button" onClick={submitOrder}>
          Submit order
          <Send className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="orderItems" columns={columns} data={data} />
    </>
  );
};
