"use client";

import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import axios from "axios";
import { Ban, Check } from "lucide-react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const submitPaid = async (isPaid: boolean) => {
    await axios.patch(`/api/${resId}/order/${orderId}`, {
      isPaid,
    });
    router.refresh();
    toast.success(`Marked as ${isPaid ? "paid" : "unpaid"}`);
  };

  return (
    <CardFooter className="flex justify-center">
      {!paid ? (
        <Button onClick={() => submitPaid(true)}>
          <Check className="mr-2 h-4 w-4" />
          Mark as paid
        </Button>
      ) : (
        <Button onClick={() => submitPaid(false)}>
          <Ban className="mr-2 h-4 w-4" />
          Mark as unpaid
        </Button>
      )}
    </CardFooter>
  );
};
