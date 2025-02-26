"use client";

import type React from "react";
import useSWR from "swr";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CurrentOrders from "./current-orders";
import FulfilledOrders from "./fulfilled-orders";
import RejectedOrders from "./rejected-orders";
import OrderModal from "./order-popup";
import { Button } from "@/components/ui/button";
import { Expand } from "lucide-react";

// API fetcher function for SWR
const fetcher = (url: string) => axios.get(url).then((res) => res.data);

interface KdsClientProps {
  data: any;
  resId: string;
  ordersServed: number;
}

export const KdsClient: React.FC<KdsClientProps> = ({
  data,
  resId,
  ordersServed,
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch pending orders in real time using SWR
  const { data: pendingData, error } = useSWR(
    `/api/${resId}/kds?state=pending`,
    fetcher,
    { refreshInterval: 1000 }
  );

  // Fallback to existing data if SWR fetch fails
  const pendingOrders =
    pendingData || data.filter((order: any) => order.accepted === null);
  const acceptedOrders = data.filter(
    (order: any) => order.accepted === true && order.status === "Pending"
  );
  const rejectedOrders = data.filter((order: any) => order.accepted === false);
  const fulfilledOrders = data.filter(
    (order: any) => order.accepted === true && order.status === "Ready"
  );

  const onAccept = async (orderId: string) => {
    try {
      setLoading(true);
      const acceptOrder = await axios.post(`/api/${resId}/kds`, {
        kdsId: orderId,
        accept: true,
        reject: false,
      });

      if (acceptOrder.status === 200) {
        toast.success("Order accepted successfully");
      }
      router.refresh();
    } catch (error) {
      toast.error("Failed to accept order");
    } finally {
      setLoading(false);
    }
  };

  const onReject = async (orderId: string, orderSlNo: string) => {
    try {
      setLoading(true);
      const acceptOrder = await axios.post(`/api/${resId}/kds`, {
        kdsId: orderId,
        reject: true,
        accept: false,
        orderSlNo,
      });

      if (acceptOrder.status === 200) {
        toast.success("Order rejected successfully");
      }
      router.refresh();
    } catch (error) {
      toast.error("Failed to reject order");
    } finally {
      setLoading(false);
    }
  };

  function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  return (
    <>
      <div className="flex items-center justify-between max-[650px]:flex-col max-[650px]:gap-5">
        <div className="flex flex-col gap-2">
          <Heading
            title="Kitchen Display System"
            description="Manage orders for your restaurant"
          />
          <Button
            variant="outline"
            className="p-2 w-max"
            onClick={toggleFullScreen}
          >
            <Expand />
          </Button>
        </div>
        <div>
          <div className="flex space-x-4">
            <div className="p-4 bg-blue-100 rounded-lg shadow-md text-black">
              <h3 className="text-lg font-semibold">Preparing</h3>
              <p className="text-sm">Orders being prepared</p>
              <span className="text-2xl font-bold">
                {acceptedOrders.length}
              </span>
            </div>
            <div className="p-4 bg-green-100 rounded-lg shadow-md text-black">
              <h3 className="text-lg font-semibold">Ready</h3>
              <p className="text-sm">Orders ready to be served</p>
              <span className="text-2xl font-bold">
                {fulfilledOrders.length}
              </span>
            </div>
            <div className="p-4 bg-yellow-100 rounded-lg shadow-md text-black">
              <h3 className="text-lg font-semibold">Served</h3>
              <p className="text-sm">Orders that have been served</p>
              <span className="text-2xl font-bold">{ordersServed}</span>
            </div>
          </div>
        </div>
      </div>
      <Separator />
      <div className="w-full">
        <Tabs defaultValue="current">
          <TabsList>
            <TabsTrigger value="current">Current</TabsTrigger>
            <TabsTrigger value="fulfilled">Fulfilled</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          <TabsContent value="current" className="w-full">
            <CurrentOrders orders={acceptedOrders} resId={resId} />
          </TabsContent>
          <TabsContent value="fulfilled" className="w-full">
            <FulfilledOrders orders={fulfilledOrders} resId={resId} />
          </TabsContent>
          <TabsContent value="rejected" className="w-full">
            <RejectedOrders orders={rejectedOrders} resId={resId} />
          </TabsContent>
        </Tabs>
        {pendingOrders.length > 0 && (
          <OrderModal
            isOpen={pendingOrders.length > 0}
            orders={pendingOrders}
            onAccept={onAccept}
            onClose={() => console.log("first")}
            onReject={onReject}
            loading={loading}
            setLoading={setLoading}
          />
        )}
      </div>
    </>
  );
};
