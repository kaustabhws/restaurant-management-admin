"use client";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OrderColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { Ban, Check, Copy, MoreHorizontal, Trash } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import { AlertModal } from "@/components/modals/alert-modal";
import MarkAsPaid from "@/components/mark-as-paid";

interface CellActionProps {
  data: OrderColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const [paymentMode, setPaymentMode] = useState("Cash");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Menu ID copied to the clipboard");
  };

  const submitPaid = async (isPaid: boolean, payMode: string) => {
    if (data.status === "Rejected") {
      toast.error("Cannot mark a rejected order as paid");
      return;
    }

    try {
      setLoading(true);
      await axios.patch(`/api/${params.restaurantId}/order/${data.id}`, {
        isPaid,
        payMode,
      });
      router.refresh();
      toast.success(`Marked as ${isPaid ? "paid" : "unpaid"}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data === "Insufficient Permissions") {
          toast.error("Insufficient permissions");
          return;
        }
      }
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

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.restaurantId}/order/${data.id}`);
      toast.success("Order deleted");
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data === "Insufficient Permissions") {
          toast.error("Insufficient permissions");
          return;
        }
      }
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy ID
          </DropdownMenuItem>
          {!data.isPaid ? (
            <MarkAsPaid
              loading={loading}
              paymentMode={paymentMode}
              setPaymentMode={setPaymentMode}
              submitPaid={submitPaid}
              ghost={true}
            />
          ) : (
            <DropdownMenuItem onClick={() => submitPaid(false, "")}>
              <Ban className="mr-2 h-4 w-4" />
              Mark as unpaid
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
