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
import { Menu, Table } from "@prisma/client";
import axios from "axios";
import { Check, ChevronsUpDown, Trash } from "lucide-react";
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
  tableId: z.string().min(1),
});

type TableFormValues = z.infer<typeof formSchema>;

interface TableFormProps {
  table: Table | null;
  menu: Menu[] | null;
  temporder: any;
}

export const TableForm: React.FC<TableFormProps> = ({
  table,
  menu,
  temporder,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");

  const title = `Edit ${table?.name}`;
  const description = `Add menu items to ${table?.name}`;
  const toastMessage = `Food added`;
  const action = `Add to order`;

  const form = useForm<TableFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      menuItem: [],
      quantity: 0,
      tableId: table?.id,
    },
  });

  const onSubmit = async (data: TableFormValues) => {
    try {
      setLoading(true);
      await axios.post(`/api/${params.restaurantId}/tableoverview`, data);
      router.refresh();
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong");
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
          <div className="grid grid-cols-3 gap-8">
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
                            ? menu?.find((menu) => menu.id === value)?.name
                            : "Select Food..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Search framework..." />
                          <CommandEmpty>No menu item found.</CommandEmpty>
                          <CommandGroup>
                            {menu?.map((menu, index) => (
                              <CommandItem
                                key={index}
                                value={menu.id}
                                onSelect={(currentValue) => {
                                  setValue(
                                    currentValue === value ? "" : currentValue
                                  );
                                  form.setValue("menuItem", currentValue);
                                  setOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    value === menu.name
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {menu.name}
                              </CommandItem>
                            ))}
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
          <OrderClient data={order} temporder={temporder} loading={loading} setLoading={setLoading} />
        </form>
      </Form>
    </>
  );
};
