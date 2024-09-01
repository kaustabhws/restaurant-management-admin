"use client";

import MarkAsPaid from "@/components/mark-as-paid";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import axios from "axios";
import { Ban } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface BillClientProps {
  resId: any;
  orderId: any;
  paid: any;
}

export const BillClient: React.FC<BillClientProps> = ({
  resId,
  orderId,
  paid,
}) => {
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const submitPaid = async (isPaid: boolean, payMode: string) => {
    try {
      setLoading(true);
      await axios.patch(`/api/${resId}/order/${orderId}`, {
        isPaid,
        payMode,
      });
      router.refresh();
      toast.success(`Marked as ${isPaid ? "paid" : "unpaid"}`);
    } catch (error) {
      if (
        (error as any).response.data ==
        "Order paid with loyalty points cannot be updated"
      ) {
        toast.error("Order paid with loyalty points cannot be updated");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardFooter className="flex justify-center">
      {!paid ? (
        <MarkAsPaid
          loading={loading}
          paymentMode={paymentMode}
          setPaymentMode={setPaymentMode}
          submitPaid={submitPaid}
          ghost={false}
        />
      ) : (
        <Button onClick={() => submitPaid(false, "")}>
          <Ban className="mr-2 h-4 w-4" />
          Mark as unpaid
        </Button>
      )}
    </CardFooter>
  );
};
