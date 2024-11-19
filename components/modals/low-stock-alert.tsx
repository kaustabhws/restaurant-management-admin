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
import { ChevronLeft, ChevronRight, IndianRupee } from "lucide-react";
import { format } from "date-fns";
import { Currency } from "@prisma/client";
import { getCurrencyIcon } from "@/lib/getCurrenctIcon";

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
  currency: Currency;
  isOpen?: boolean;
  onClose?: () => void;
}

export function LowStockModal({
  items,
  currency,
  isOpen: propIsOpen,
  onClose: propOnClose,
}: LowStockModalProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const lowStockAcknowledged =
        localStorage.getItem("lowStockAcknowledged") !== "false";
      const acknowledgedItemsLength = parseInt(
        localStorage.getItem("acknowledgedItemsLength") || "0",
        10
      );

      setInternalIsOpen(
        lowStockAcknowledged || items.length > acknowledgedItemsLength
      );
    }
  }, [items.length]);

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
      localStorage.setItem("acknowledgedItemsLength", items.length.toString());
    }
    handleClose();
  };

  if (items.length === 0) {
    if (typeof window !== "undefined") {
      localStorage.setItem("lowStockAcknowledged", "true");
      localStorage.setItem("acknowledgedItemsLength", "0");
    }
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
            <p className="flex items-center">
              Price:{" "}
              {getCurrencyIcon({
                currency: currency,
                className: "ml-1",
                size: 14,
              })}
              {currentItem.price.toFixed(2)}/{currentItem.unit}
            </p>
            <p>
              Last Restocked:{" "}
              {currentItem.lastRestockedAt
                ? format(new Date(currentItem.lastRestockedAt), "PPpp")
                : "Never"}
            </p>
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
