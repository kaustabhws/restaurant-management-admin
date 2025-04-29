"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { TimePickerInput } from "../time-picker-input";
import { TimePeriodSelect } from "../time-period-select";
import { useRef, useState } from "react";
import { Period } from "@/utils/time-picker-utils";
import axios from "axios";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  openingTime: z.date({ required_error: "Opening time is required." }),
  closingTime: z.date({ required_error: "Closing time is required." }),
});

export function BusinessHoursModal({ resId }: { resId: string }) {
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      openingTime: new Date(),
      closingTime: new Date(),
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const formatTime = (date: Date) =>
      date.toLocaleTimeString("en-GB", { hour12: false });

    try {
      const response = await axios.patch(`/api/res/${resId}`, {
        openingTime: formatTime(data.openingTime),
        closingTime: formatTime(data.closingTime),
      });
      toast.success("Business hours updated successfully");
      router.refresh();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data === "Insufficient Permissions") {
          toast.error("Insufficient permissions");
          return;
        }
      }
      toast.error("Something went wrong");
    }
  }

  const [open, setOpen] = useState(true);

  const [openingPeriod, setOpeningPeriod] = useState<Period>("AM");
  const [closingPeriod, setClosingPeriod] = useState<Period>("PM");

  const openingMinuteRef = useRef<HTMLInputElement>(null);
  const openingHourRef = useRef<HTMLInputElement>(null);
  const openingSecondRef = useRef<HTMLInputElement>(null);
  const openingPeriodRef = useRef<HTMLButtonElement>(null);

  const closingMinuteRef = useRef<HTMLInputElement>(null);
  const closingHourRef = useRef<HTMLInputElement>(null);
  const closingSecondRef = useRef<HTMLInputElement>(null);
  const closingPeriodRef = useRef<HTMLButtonElement>(null);

  return (
    <Dialog
      open={open}
      onOpenChange={() => toast.error("Set business hours to close")}
    >
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule Business Hours</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Opening Time */}
            <FormField
              control={form.control}
              name="openingTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opening Time</FormLabel>
                  <div className="flex items-end gap-2">
                    <TimePickerInput
                      picker="12hours"
                      period={openingPeriod}
                      date={field.value}
                      setDate={field.onChange}
                      ref={openingHourRef}
                      onRightFocus={() => openingMinuteRef.current?.focus()}
                    />
                    <TimePickerInput
                      picker="minutes"
                      date={field.value}
                      setDate={field.onChange}
                      ref={openingMinuteRef}
                      onLeftFocus={() => openingHourRef.current?.focus()}
                      onRightFocus={() => openingSecondRef.current?.focus()}
                    />
                    <TimePickerInput
                      picker="seconds"
                      date={field.value}
                      setDate={field.onChange}
                      ref={openingSecondRef}
                      onLeftFocus={() => openingMinuteRef.current?.focus()}
                      onRightFocus={() => openingPeriodRef.current?.focus()}
                    />
                    <TimePeriodSelect
                      period={openingPeriod}
                      setPeriod={setOpeningPeriod}
                      date={field.value}
                      setDate={field.onChange}
                      ref={openingPeriodRef}
                      onLeftFocus={() => openingSecondRef.current?.focus()}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Closing Time */}
            <FormField
              control={form.control}
              name="closingTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Closing Time</FormLabel>
                  <div className="flex items-end gap-2">
                    <TimePickerInput
                      picker="12hours"
                      period={closingPeriod}
                      date={field.value}
                      setDate={field.onChange}
                      ref={closingHourRef}
                      onRightFocus={() => closingMinuteRef.current?.focus()}
                    />
                    <TimePickerInput
                      picker="minutes"
                      date={field.value}
                      setDate={field.onChange}
                      ref={closingMinuteRef}
                      onLeftFocus={() => closingHourRef.current?.focus()}
                      onRightFocus={() => closingSecondRef.current?.focus()}
                    />
                    <TimePickerInput
                      picker="seconds"
                      date={field.value}
                      setDate={field.onChange}
                      ref={closingSecondRef}
                      onLeftFocus={() => closingMinuteRef.current?.focus()}
                      onRightFocus={() => closingPeriodRef.current?.focus()}
                    />
                    <TimePeriodSelect
                      period={closingPeriod}
                      setPeriod={setClosingPeriod}
                      date={field.value}
                      setDate={field.onChange}
                      ref={closingPeriodRef}
                      onLeftFocus={() => closingSecondRef.current?.focus()}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
