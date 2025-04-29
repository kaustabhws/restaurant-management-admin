"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Utensils } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface CurrentOrdersProps {
  orders: any[];
  resId: string;
}

const CurrentOrders: React.FC<CurrentOrdersProps> = ({ orders, resId }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const orderSubmit = async (orderId: string, orderSlNo: string) => {
    try {
      setLoading(true);
      // Accept order
      const acceptOrder = await axios.patch(`/api/${resId}/kds`, {
        kdsId: orderId,
        markAsDone: true,
        orderSlNo: orderSlNo,
      });

      if (acceptOrder.status === 200) {
        toast.success("Order accepted successfully");
      }
      router.refresh();
    } catch (error) {
      if(axios.isAxiosError(error)) {
        if(error.response?.data === "Insufficient Permissions") {
          toast.error("Insufficient permissions")
          return
        }
      }
      toast.error("Failed to accept order");
    } finally {
      setLoading(false);
    }
  };

  const orderReject = async (itemId: string) => {
    try {
      const resp = await axios.patch(`/api/${resId}/kds/${itemId}`, {
        status: "Rejected",
      });

      if (resp.status === 200) {
        toast.success("Order rejected successfully");
        router.refresh();
      }
    } catch (error) {
      if(axios.isAxiosError(error)) {
        if(error.response?.data === "Insufficient Permissions") {
          toast.error("Insufficient permissions")
          return
        }
      }
      toast.error("Failed to reject order");
    }
  };

  return (
    <div className="mt-8 flex flex-wrap gap-4">
      {orders.length > 0 ? (
        orders.map((order) => (
          <Card key={order.id} className="border shadow-lg w-80">
            {/* Header */}
            <CardHeader className="bg-yellow-600 text-white p-4 rounded-t-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Utensils size={18} />
                  <span className="font-semibold">
                    Table {order.tableNo ?? "N/A"}
                  </span>
                </div>
                <Badge variant="outline" className="bg-white text-yellow-700">
                  {order.orderType.replace("_", " ")}
                </Badge>
              </div>
              <div className="mt-1">
                <p className="flex items-center text-xs">
                  <Clock size={14} className="mr-1" />
                  {new Date(order.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </CardHeader>

            {/* Items List */}
            <CardContent className="p-4">
              <ul className="space-y-2">
                {order.items.map((item: any) => (
                  <div className="flex items-center justify-between" key={item.id}>
                    <li key={item.id} className="text-sm">
                      <span className="font-semibold">{item.quantity}x</span>{" "}
                      {item.itemName}
                      {item.status && (
                        <p
                          className={`text-xs italic text-gray-600 ${
                            item.status === "Rejected" ? "text-red-500" : ""
                          }`}
                        >
                          {item.status}
                        </p>
                      )}
                    </li>
                    {item.status !== "Rejected" && (
                      <Badge
                        className="hover:cursor-pointer hover:bg-red-500"
                        onClick={() => orderReject(item.id)}
                      >
                        Reject
                      </Badge>
                    )}
                  </div>
                ))}
              </ul>
            </CardContent>

            {/* Footer */}
            <CardFooter className="p-4">
              <Button
                className="w-full"
                onClick={() => orderSubmit(order.id, order.orderId)}
                disabled={loading}
              >
                Mark As Done
              </Button>
            </CardFooter>
          </Card>
        ))
      ) : (
        <p className="text-center text-gray-500">No current orders</p>
      )}
    </div>
  );
};

export default CurrentOrders;
