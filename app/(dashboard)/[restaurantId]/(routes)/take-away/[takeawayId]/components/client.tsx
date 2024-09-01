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
import CustomerDetailsSubmit from "@/components/customer-details";
import { useState } from "react";

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

  const [contact, setContact] = useState("");
  const [contactMethod, setContactMethod] = useState("phone");

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
      takeawayId:
        temporder.find((order: any) => order.takeawayId)?.takeawayId ||
        undefined,
      totalAmount: temporder.reduce(
        (sum: any, order: any) => sum + order.amount,
        0
      ),
    },
    customer : {
      contact,
      contactMethod
    }
  };

  const submitOrder = async () => {
    try {
      setLoading(true);
      if (
        !resultData.resultData.menuItems ||
        resultData.resultData.menuItems.length === 0
      ) {
        toast.error("No food ordered");
        return;
      }
      const orderId = await axios.post(
        `/api/${params.restaurantId}/order`,
        resultData
      );
      router.push(`/${params.restaurantId}/bill/${orderId.data.id}`);
      toast.success("Food order submitted");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between max-[400px]:flex-col max-[400px]:gap-3 max-[400px]:items-start">
        <Heading
          title={`Foods ordered (${data.length})`}
          description="List of ordered foods"
        />
        <CustomerDetailsSubmit
          loading={loading}
          submitOrder={submitOrder}
          contact={contact}
          setContact={setContact}
          contactMethod={contactMethod}
          setContactMethod={setContactMethod}
        />
      </div>
      <Separator />
      <DataTable searchKey="orderItems" columns={columns} data={data} />
    </>
  );
};
