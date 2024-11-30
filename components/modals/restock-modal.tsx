"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InventoryColumn } from "@/app/(dashboard)/[restaurantId]/(routes)/inventory/components/columns";
import { getCurrencyIcon } from "@/lib/getCurrenctIcon";
import { Currency } from "@prisma/client";
import { Checkbox } from "../ui/checkbox";

interface RestockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: z.infer<typeof formSchema>) => void;
  loading: boolean;
  inventoryItem: InventoryColumn;
  currency: Currency;
}

const formSchema = z.object({
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  price: z.coerce.number(),
  inventoryItemId: z.string(),
  isExpense: z.boolean().default(false)
});

export const RestockModal: React.FC<RestockModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  inventoryItem,
  currency,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: 0,
      price: 0,
      inventoryItemId: inventoryItem.id,
      isExpense: false,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onConfirm(values);
  };

  const watchQuantity = form.watch("quantity");

  const calculateTotalPrice = (quantity: number) => {
    const pricePerUnit = parseFloat(inventoryItem.price.split("/")[0]);
    form.setValue("price", parseFloat((quantity * pricePerUnit).toFixed(2)));
    return (quantity * pricePerUnit).toFixed(2);
  };

  const currentStock = parseInt(inventoryItem.availableQuantity.split(" ")[0]);

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Restock {inventoryItem.name}</DialogTitle>
          <DialogDescription>
            Add new stock to your inventory. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity to Add ({inventoryItem.unit})</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-y-2">
              <p className="text-sm font-medium">
                Current Stock: {inventoryItem.availableQuantity}
              </p>
              <p className="text-sm font-medium">
                New Stock: {currentStock + (watchQuantity || 0)}{" "}
                {inventoryItem.unit}
              </p>
              <p className="text-sm font-medium flex items-center gap-1">
                Total Value:
                {getCurrencyIcon({ currency: currency, size: 14 })}
                {calculateTotalPrice(watchQuantity || 0)}
              </p>
            </div>
            <FormField
              control={form.control}
              name="isExpense"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Mark as an expense (This will be added to your expenses)
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                Confirm Restock
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
