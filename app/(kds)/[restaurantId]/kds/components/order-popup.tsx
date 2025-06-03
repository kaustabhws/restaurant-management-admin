"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface OrderModalProps {
  orders: any[] | any;
  isOpen: boolean;
  onClose: () => void;
  onAccept: (orderId: string) => void;
  onReject: (orderId: string, orderSlNo: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export default function OrderModal({
  orders,
  isOpen,
  onClose,
  onAccept,
  onReject,
  loading,
  setLoading,
}: OrderModalProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const currentOrder = orders[currentPage];

  // Play sound when dialog opens
  useEffect(() => {
    if (isOpen) {
      const audio = new Audio("/notification.mp3");
      audio.play().catch((err) => console.error("Audio play failed:", err));
    }
  }, [isOpen]);

  const handleAccept = () => {
    onAccept(currentOrder.id);
  };

  const handleReject = () => {
    onReject(currentOrder.id, currentOrder.orderId);
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(orders.length - 1, prev + 1));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <Badge
              className="justify-self-start"
              variant={
                currentOrder.orderType === "DINE_IN" ? "default" : "secondary"
              }
            >
              {currentOrder.orderType === "DINE_IN" ? "Dine In" : "Take Away"}
            </Badge>
            <Badge
              className="justify-self-end"
              variant={
                currentOrder.status === "Pending" ? "outline" : "default"
              }
            >
              {currentOrder.status}
            </Badge>
          </div>
          {currentOrder.tableNo && (
            <div className="grid grid-cols-2 items-center gap-4">
              <span className="text-sm text-muted-foreground">Table No:</span>
              <span className="text-sm font-medium justify-self-end">
                {currentOrder.tableNo}
              </span>
            </div>
          )}
          <Separator />
          <div>
            <h4 className="font-semibold mb-2 text-lg">Items:</h4>
            <ul className="space-y-2">
              {currentOrder.items.map((item: any) => (
                <li key={item.id} className="flex justify-between items-center">
                  <span className="text-base font-medium">{item.itemName}</span>
                  <span className="text-sm bg-muted px-2 py-1 rounded">
                    x{item.quantity}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <Separator />
          <div className="text-sm text-muted-foreground">
            Created at: {currentOrder.createdAt.toLocaleString()}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button onClick={handleAccept} variant="default" disabled={loading}>
              Accept
            </Button>
            {/* <Button
              onClick={handleReject}
              variant="destructive"
              disabled={loading}
            >
              Reject
            </Button> */}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={handlePrevious}
              disabled={currentPage === 0}
              variant="outline"
              size="icon"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              {currentPage + 1} of {orders.length}
            </span>
            <Button
              onClick={handleNext}
              disabled={currentPage === orders.length - 1}
              variant="outline"
              size="icon"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
