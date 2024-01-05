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
import { Ban, Check, Copy, MoreHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

interface CellActionProps {
  data: OrderColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Menu ID copied to the clipboard");
  };

  const submitPaid = async (isPaid: boolean) => {
    await axios.patch(`/api/${params.restaurantId}/order/${data.id}`, {
      isPaid,
    });
    router.refresh();
    toast.success(`Marked as ${isPaid ? 'paid' : 'unpaid'}`);
  };

  return (
    <>
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
            <DropdownMenuItem onClick={() => submitPaid(true)}>
              <Check className="mr-2 h-4 w-4" />
              Mark as paid
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => submitPaid(false)}>
              <Ban className="mr-2 h-4 w-4" />
              Mark as unpaid
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
