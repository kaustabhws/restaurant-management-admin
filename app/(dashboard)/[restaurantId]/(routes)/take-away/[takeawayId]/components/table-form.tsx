"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Inventory, Menu, Prisma } from "@prisma/client";
import axios from "axios";
import { Check, ChevronsUpDown } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { OrderClient } from "./client";
import { OrderColumn } from "./order-status";
import { format } from "date-fns";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const formSchema = z.object({
  menuItem: z.union([z.string(), z.array(z.string())]),
  quantity: z.coerce.number().min(1),
  takeAwayId: z.string().min(1),
});

type MenuWithIngredients = Prisma.MenuGetPayload<{
  include: { ingredients: true };
}>;

type TableFormValues = z.infer<typeof formSchema>;

interface TableFormProps {
  takeAwayId: string;
  menu: MenuWithIngredients[] | null;
  temporder: any;
  inventory: Inventory[] | null;
}

export const TableForm: React.FC<TableFormProps> = ({
  takeAwayId,
  menu,
  temporder,
  inventory,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");

  const title = `Edit takeaway order`;
  const description = `Add menu items to takeaway order`;
  const toastMessage = `Food added`;
  const action = `Add to order`;

  const form = useForm<TableFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      menuItem: [],
      quantity: 0,
      takeAwayId: takeAwayId,
    },
  });

  const onSubmit = async (data: TableFormValues) => {
    try {
      setLoading(true);
      await axios.post(`/api/${params.restaurantId}/tableoverview`, data);
      router.refresh();
      toast.success(toastMessage);
    } catch (error) {
      if(axios.isAxiosError(error)) {
        if(error.response?.data === "Insufficient Permissions") {
          toast.error("Insufficient permissions")
          return
        }
      }
      if (axios.isAxiosError(error)) {
        if (error.response?.data === "Insufficient stock for ingredient") {
          toast.error("Insufficient ingredients in stock");
        }
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const order: OrderColumn[] = temporder?.map((item: any) => ({
    id: item.id,
    orderItems: item.orderItems
      .map((orderItem: any) => orderItem.menuItem.name)
      .join(", "),
    quantity: item.orderItems.map((orderItem: any) => orderItem.quantity),
    isPaid: item.isPaid,
    amount: item.amount,
    takeAwayId: takeAwayId,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="flex items-center gap-10 flex-wrap">
            <FormField
              control={form.control}
              name="menuItem"
              render={({ field }) => (
                <FormItem className="flex flex-col mt-2">
                  <FormLabel>Food Item</FormLabel>
                  <FormControl>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-[200px] justify-between"
                        >
                          {value
                            ? menu?.find(
                                (menu) =>
                                  menu.name.toLowerCase() ===
                                  value.toLowerCase()
                              )?.name
                            : "Select Food..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search food..." />
                          <CommandEmpty>No menu item found.</CommandEmpty>
                          <CommandGroup>
                            {menu?.map((menuItem, index) => {
                              const isInStock = menuItem.ingredients.every(
                                (ingredient) => {
                                  const inventoryItem = inventory?.find(
                                    (inv) => inv.id === ingredient.inventoryId
                                  );
                                  return (
                                    inventoryItem &&
                                    inventoryItem.availableQuantity >=
                                      ingredient.quantityUsed
                                  );
                                }
                              );

                              return (
                                <CommandItem
                                  key={index}
                                  value={menuItem.name}
                                  onSelect={(currentValue) => {
                                    if (isInStock) {
                                      setValue(
                                        currentValue === value
                                          ? ""
                                          : currentValue
                                      );
                                      form.setValue("menuItem", menuItem.id);
                                      setOpen(false);
                                    }
                                  }}
                                  disabled={!isInStock}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      value === menuItem.name
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {menuItem.name}
                                  {!isInStock && (
                                    <span className="ml-2 text-red-500">
                                      (Out of Stock)
                                    </span>
                                  )}
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto mt-5" type="submit">
            {action}
          </Button>
          <OrderClient
            data={order}
            temporder={temporder}
            loading={loading}
            setLoading={setLoading}
          />
        </form>
      </Form>
    </>
  );
};
