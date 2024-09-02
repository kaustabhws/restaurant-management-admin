"use client";

import { CoinsIcon, LoaderCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Customer = {
  id: string;
  email: string | null;
  phone: string | null;
  loyaltyPoints: number;
  totalSpent: number;
};

type Order = {
  id: string;
  slNo: string;
  resId: string;
  tableNo: string | null;
  payMode: string;
  orderType: string;
  amount: number;
  isPaid: boolean;
};

interface LoyaltyPaymentProps {
  customer: Customer;
  order: Order;
}

const LoyaltyPayment: React.FC<LoyaltyPaymentProps> = ({ customer, order }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const submitOrder = async (isPaid: boolean, payMode: string) => {
    try {
      setLoading(true);
      await axios.patch(`/api/${order.resId}/loyalty/${order.id}`, {
        isPaid,
        payMode,
      });
      router.refresh();
      toast.success(`Marked as ${isPaid ? "paid" : "unpaid"}`);
    } catch (error) {
      if ((error as any).response.data == "Order is already paid") {
        toast.error("Order paid with loyalty points cannot be changed");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-around flex-1 max-[384px]:flex-col gap-3">
      <div className="flex items-center space-x-2 bg-secondary rounded-md px-3 py-2 text-center">
        <CoinsIcon className="h-4 w-4 text-secondary-foreground" />
        <span className="text-sm font-medium text-secondary-foreground">
          {customer.loyaltyPoints} Points Available
        </span>
      </div>
      <Button
        disabled={
          customer.loyaltyPoints < order.amount || loading || order.isPaid
        }
        onClick={() => submitOrder(true, "Loyalty Points")}
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <LoaderCircle className="animate-spin" /> Paying...
          </div>
        ) : (
          "Pay using Loyalty"
        )}
      </Button>
    </div>
  );
};

export default LoyaltyPayment;
