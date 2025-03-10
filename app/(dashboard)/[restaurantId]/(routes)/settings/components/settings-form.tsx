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
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { Country, State } from "country-state-city";
import { IState } from "country-state-city";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Period } from "@/utils/time-picker-utils";
import { TimePeriodSelect } from "@/components/time-period-select";
import { TimePickerInput } from "@/components/time-picker-input";

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
  upiId: z.string(),
  street: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  zipcode: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
  country: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  gstNo: z.string().min(1).optional(),
  openingTime: z.date({ required_error: "Opening time is required." }),
  closingTime: z.date({ required_error: "Closing time is required." }),
});

type SettingsFormValues = z.infer<typeof formSchema>;

const parseTime = (timeStr: string | null) => {
  if (!timeStr) return null; // Handle empty values

  const [hours, minutes, seconds] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(hours || 0, minutes || 0, seconds || 0, 0); // Ensure valid time values

  return date;
};

export const SettingsForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allCountries] = useState(Country.getAllCountries());
  const [states, setStates] = useState<IState[]>([]);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...initialData,
      openingTime: parseTime(initialData?.openingTime) ?? new Date(),
      closingTime: parseTime(initialData?.closingTime) ?? new Date(),
    },
  });

  const onCountryChange = (isoCode: string) => {
    form.setValue("country", isoCode);
    const statesData = State.getStatesOfCountry(isoCode);
    setStates(statesData);
    form.setValue("state", "");
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-GB", { hour12: false });

  const [openingPeriod, setOpeningPeriod] = useState<Period>(() => {
    if (!initialData?.openingTime) return "AM"; // Default if no data
    const hours = parseInt(initialData.openingTime.split(":")[0], 10);
    return hours >= 12 ? "PM" : "AM";
  });

  const [closingPeriod, setClosingPeriod] = useState<Period>(() => {
    if (!initialData?.closingTime) return "PM"; // Default if no data
    const hours = parseInt(initialData.closingTime.split(":")[0], 10);
    return hours >= 12 ? "PM" : "AM";
  });

  const openingMinuteRef = useRef<HTMLInputElement>(null);
  const openingHourRef = useRef<HTMLInputElement>(null);
  const openingSecondRef = useRef<HTMLInputElement>(null);
  const openingPeriodRef = useRef<HTMLButtonElement>(null);

  const closingMinuteRef = useRef<HTMLInputElement>(null);
  const closingHourRef = useRef<HTMLInputElement>(null);
  const closingSecondRef = useRef<HTMLInputElement>(null);
  const closingPeriodRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (form.watch("country") || initialData.country) {
      const countryCode = form.watch("country") || initialData.country;
      const fetchedStates = State.getStatesOfCountry(countryCode);
      setStates(fetchedStates);
    }
  }, [form.watch("country"), initialData.country]);

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true);
      await axios.patch(`/api/res/${params.restaurantId}`, {
        ...data,
        openingTime: formatTime(data.openingTime),
        closingTime: formatTime(data.closingTime),
      });
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
            {/* Restaurant Name */}
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
            {/* Currency */}
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem className="w-[500px] max-[590px]:w-full">
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
            {/* UPI ID */}
            <FormField
              control={form.control}
              name="upiId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UPI ID</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="xxxxxx@okaxis"
                      {...field}
                      className="w-[500px] max-[590px]:w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Phone No */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone No</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="9999999999"
                      {...field}
                      className="w-[500px] max-[590px]:w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* GST No */}
            <FormField
              control={form.control}
              name="gstNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GSTIN</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="9999999999"
                      {...field}
                      className="w-[500px] max-[590px]:w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator className="my-3" />
            {/* Street */}
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="XYZ Street"
                      {...field}
                      className="w-[500px] max-[590px]:w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* City */}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="XYZ city"
                      {...field}
                      className="w-[500px] max-[590px]:w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Zipcode */}
            <FormField
              control={form.control}
              name="zipcode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zipcode</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="xxxxxx"
                      {...field}
                      className="w-[500px] max-[590px]:w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Country */}
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="w-[500px] max-[590px]:w-full">
                  <FormLabel>Country</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={(value) => {
                      field.onChange(value);
                      onCountryChange(value);
                    }}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a country"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allCountries.map((country) => (
                        <SelectItem
                          key={country.isoCode}
                          value={country.isoCode}
                        >
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* State */}
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="w-[500px] max-[590px]:w-full">
                  <FormLabel>State</FormLabel>
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
                          placeholder="Select a state"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {states.map((state: any) => (
                        <SelectItem key={state.isoCode} value={state.name}>
                          {state.name}
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
