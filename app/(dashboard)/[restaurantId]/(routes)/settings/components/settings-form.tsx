"use client";

import { AlertModal } from "@/components/modals/alert-modal";
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
import { Currency, Restaurants } from "@prisma/client";
import axios from "axios";
import { AlertTriangle, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const currencyOptions = [
  { name: "US Dollar", value: "dollar" },
  { name: "Indian Rupee", value: "rupee" },
  { name: "Euro", value: "euro" },
  { name: "Japanese Yen", value: "yen" },
  { name: "British Pound Sterling", value: "pound" },
  { name: "Russian Ruble", value: "ruble" },
  { name: "Philippine Peso", value: "peso" },
];

interface SettingsFormProps {
  initialData: Restaurants;
}

const formSchema = z.object({
  name: z.string().min(1),
  currency: z.nativeEnum(Currency),
});

type SettingsFormValues = z.infer<typeof formSchema>;

export const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true);
      await axios.patch(`/api/res/${params.restaurantId}`, data);
      router.refresh();
      toast.success("Restaurant updated");
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/res/${params.restaurantId}`);
      router.refresh();
      router.push("/");
      toast.success("Restaurant deleted");
    } catch (error) {
      toast.error("Make sure you removed all products and categories first");
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
      <div className="flex items-center justify-between">
        <Heading
          title="Profile"
          description="This is how others will see you on the site."
        />
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Restaurant Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Restaurant name"
                      {...field}
                      className="w-[500px] max-[590px]:w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem className='w-[500px] max-[590px]:w-full'>
                  <FormLabel>Currency</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a currency"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currencyOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} type="submit" className="ml-auto mt-5">
            Save Changes
          </Button>
        </form>
      </Form>
      <div className="mt-6 flex justify-between items-center">
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
          <p className="text-sm text-muted-foreground">
            Once you delete your restaurant, there is no going back. Please be
            certain.
          </p>
          <Button
            type="button"
            disabled={loading}
            variant="destructive"
            onClick={() => setOpen(true)}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-200 mt-3"
          >
            <Trash className="h-4 w-4" />
            <span>Delete Restaurant</span>
            <span className="sr-only">Delete this restaurant</span>
          </Button>
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <h3 className="text-sm font-medium text-yellow-800">Warning</h3>
            </div>
            <p className="mt-2 text-sm text-yellow-700">
              Deleting your restaurant will permanently remove all associated
              data, including menus, orders, and customer information. This
              action cannot be undone.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
