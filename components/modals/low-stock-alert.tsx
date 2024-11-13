"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface LowStockItem {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  availableQuantity: number;
  unit: string;
  minStockThreshold: number;
  price: number;
  totalCost: number;
  lastRestockedAt: Date | null;
  resId: string;
}

interface LowStockModalProps {
  items: LowStockItem[];
  isOpen?: boolean;
  onClose?: () => void;
}

export function LowStockModal({
  items,
  isOpen: propIsOpen,
  onClose: propOnClose,
}: LowStockModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("lowStockAcknowledged") !== "false";
    }
    return true;
  });
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = items.length;
  const currentItem = items[currentPage - 1];

  const isControlled = propIsOpen !== undefined;
  const isOpen = isControlled ? propIsOpen : internalIsOpen;

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleClose = () => {
    if (isControlled) {
      propOnClose?.();
    } else {
      setInternalIsOpen(false);
    }
  };

  const handleAcknowledgeAll = () => {
    if (!isControlled) {
      localStorage.setItem("lowStockAcknowledged", "false");
    }
    handleClose();
  };

  if (items.length === 0) {
    localStorage.setItem("lowStockAcknowledged", "true");
    return null;
  }

  return (
    <Dialog
      open={
        isControlled
          ? isOpen
          : internalIsOpen &&
            localStorage.getItem("lowStockAcknowledged") !== "false"
      }
      onOpenChange={handleClose}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Low Stock Alert</DialogTitle>
          <DialogDescription>
            The following item is running low on stock and needs attention.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">{currentItem.name}</h3>
            <p>
              Available Quantity:{" "}
              <span className="text-red-500 font-medium">
                {currentItem.availableQuantity} {currentItem.unit}
              </span>
            </p>
            <p>
              Minimum Threshold: {currentItem.minStockThreshold}{" "}
              {currentItem.unit}
            </p>
            <p>
              Price: ₹{currentItem.price.toFixed(2)}/{currentItem.unit}
            </p>
            <p>Total Cost: ₹{currentItem.totalCost.toFixed(2)}</p>
            <p>
              Last Restocked:{" "}
              {currentItem.lastRestockedAt
                ? format(new Date(currentItem.lastRestockedAt), "PPpp")
                : "Never"}
            </p>
            <p>Created At: {format(new Date(currentItem.createdAt), "PPpp")}</p>
            <p>Updated At: {format(new Date(currentItem.updatedAt), "PPpp")}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <Button
            onClick={prevPage}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Item {currentPage} of {totalPages}
          </span>
          <Button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
        <div className="mt-4 text-center">
          <Button onClick={handleAcknowledgeAll} variant="default">
            Acknowledge All
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
