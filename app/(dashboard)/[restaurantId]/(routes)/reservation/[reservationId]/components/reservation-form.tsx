"use client";

import { TimePicker } from "@/components/time-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Reservation, Table } from "@prisma/client";
import axios from "axios";
import { format, isSameDay } from "date-fns";
import { CalendarIcon, Clock, Trash, Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  visitors: z.coerce.number().min(1),
  date: z.date(),
  tableId: z.string().min(1),
  status: z.string().min(1),
});

type ReservationFormValues = z.infer<typeof formSchema>;

interface ReservationFormProps {
  initialData: Reservation | null;
  tables: Table[];
  reservations: Reservation[];
}

export const ReservationForm: React.FC<ReservationFormProps> = ({
  initialData,
  tables,
  reservations,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit reservation" : "Create reservation";
  const description = initialData
    ? "Edit a reservation"
    : "Create a reservation";
  const toastMessage = initialData
    ? "Reservation updated"
    : "Reservation created";
  const action = initialData ? "Save changes" : "Create reservation";

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? { ...initialData, phone: String(initialData.phone) }
      : {
          name: "",
          phone: "",
          visitors: 0,
          date: new Date(),
          tableId: "",
          status: "Upcoming",
        },
  });

  useEffect(() => {
    // Update the time in the field only on the client side after hydration
    const updateTime = () => {
      const currentDate = form.getValues("date");
      if (currentDate) {
        form.setValue("date", new Date(currentDate));
      }
    };

    updateTime();
  }, []);

  const [selectedDateReservations, setSelectedDateReservations] = useState<
    Reservation[]
  >([]);

  useEffect(() => {
    // Update the time in the field only on the client side after hydration
    const updateTime = () => {
      const currentDate = form.getValues("date");
      if (currentDate) {
        form.setValue("date", new Date(currentDate));
      }
    };

    updateTime();
  }, []);

  useEffect(() => {
    // Update the list of reservations for the selected date
    const selectedDate = form.getValues("date");
    if (selectedDate) {
      const filteredReservations = reservations.filter(
        (reservation) =>
          isSameDay(new Date(reservation.date), selectedDate) &&
          reservation.status === "Upcoming"
      );
      setSelectedDateReservations(filteredReservations);
    }
  }, [form.watch("date"), reservations]);

  const onSubmit = async (data: ReservationFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.restaurantId}/reservation/${params.reservationId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.restaurantId}/reservation`, data);
      }
      router.push(`/${params.restaurantId}/reservation`);
      router.refresh();
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="spave-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8 max-[740px]:grid-cols-2 max-[380px]:grid-cols-1">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="John Doe"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      disabled={loading}
                      placeholder="9999999999"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="visitors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visitors</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="4"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-3">
                  <FormLabel className="text-left">Date & Time</FormLabel>
                  <Popover>
                    <FormControl>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP HH:mm")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                    </FormControl>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={field.onChange}
                        initialFocus
                      />
                      <div className="p-3 border-t border-border">
                        <TimePicker
                          setDate={field.onChange}
                          date={field.value ? new Date(field.value) : undefined}
                        />
                      </div>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tableId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Available Tables</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a table" />
                      </SelectTrigger>
                      <SelectContent>
                        {tables.map((table) => (
                          <SelectItem
                            disabled={
                              table.status === "Reserved" ||
                              table.status === "Occupied"
                            }
                            key={table.id}
                            value={table.id}
                          >
                            <p>
                              {table.name} ({table.seats} seats)
                            </p>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a status"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Upcoming">Upcoming</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto mt-5" type="submit">
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
      {selectedDateReservations.length > 0 && (
        <div className="mt-8">
          <Heading
            title="Upcoming Reservations"
            description="Reservations for the selected date"
          />
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedDateReservations.map((reservation) => (
              <Card key={reservation.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-primary p-4">
                    <h3 className="text-lg font-semibold text-primary-foreground">
                      {reservation.name}
                    </h3>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>
                        {format(new Date(reservation.date), "h:mm a")}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>
                        {reservation.visitors}{" "}
                        {reservation.visitors === 1 ? "guest" : "guests"}
                      </span>
                    </div>
                    <Badge variant="secondary" className="mt-2">
                      {tables.find((t) => t.id === reservation.tableId)?.name ||
                        "N/A"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
