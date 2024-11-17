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
import { Inventory, Menu, Prisma } from "@prisma/client";
import axios from "axios";
import { Check, ChevronsUpDown, Plus, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import { cn } from "@/lib/utils";
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
import ImageUpload from "@/components/ui/image-upload";

const formSchema = z.object({
  name: z.string().min(1),
  price: z.coerce.number().min(1),
  images: z.object({ url: z.string() }).array(),
  ingredients: z.array(
    z.object({
      inventoryId: z.string(),
      quantityUsed: z.coerce.number().min(1),
    })
  ),
});

type MenuWithIngredients = Prisma.MenuGetPayload<{
  include: { ingredients: true, images: true };
}>;

type MenuFormValues = z.infer<typeof formSchema>;

interface MenuFormProps {
  initialData: MenuWithIngredients | null;
  inventory: Inventory[];
}

export const MenuForm: React.FC<MenuFormProps> = ({
  initialData,
  inventory,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit menu item" : "Create menu item";
  const description = initialData ? "Edit a menu item" : "Create a menu item";
  const toastMessage = initialData ? "Menu item updated" : "Menu item created";
  const action = initialData ? "Save changes" : "Create menu item";

  const form = useForm<MenuFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          images: initialData.images || [],
          ingredients: initialData.ingredients || [],
        }
      : {
          name: "",
          images: [],
          price: 0,
          ingredients: [],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "ingredients",
  });

  const selectedIngredientIds = form
    .watch("ingredients")
    .map((ingredient) => ingredient.inventoryId);

  const onSubmit = async (data: MenuFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.restaurantId}/menu/${params.menuId}`,
          data
        );
      } else {
        await axios.post(`/api/${params.restaurantId}/menu`, data);
      }
      router.push(`/${params.restaurantId}/menu`);
      router.refresh();
      toast.success(toastMessage);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.restaurantId}/menu/${params.menuId}`);
      router.push(`/${params.restaurantId}/menu`);
      router.refresh();
      toast.success("Menu deleted");
    } catch (error) {
      toast.error("Something went wrong");
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
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value.map((image) => image.url)}
                    disabled={loading}
                    onChange={(url) =>
                      field.onChange([...field.value, { url }])
                    }
                    onRemove={(url) =>
                      field.onChange([
                        ...field.value.filter((current) => current.url !== url),
                      ])
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                      placeholder="Menu item name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      disabled={loading}
                      placeholder="9.99"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col w-max max-[380px]:w-full">
            <FormLabel>Ingredients</FormLabel>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center gap-2 max-[380px]:flex-col"
              >
                <div className="flex items-center space-x-2 mt-2 max-[380px]:flex-col max-[380px]:gap-3 w-full">
                  <FormField
                    control={form.control}
                    name={`ingredients.${index}.inventoryId`}
                    render={({ field }) => (
                      <FormItem className="flex-grow w-full">
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-full justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? inventory.find(
                                      (item) => item.id === field.value
                                    )?.name
                                  : "Select ingredient"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0 max-[380px]:w-full">
                            <Command>
                              <CommandInput placeholder="Search ingredient..." />
                              <CommandEmpty>No ingredient found.</CommandEmpty>
                              <CommandGroup>
                                {inventory.map((item) => (
                                  <CommandItem
                                    value={item.name}
                                    key={item.id}
                                    disabled={selectedIngredientIds.includes(
                                      item.id
                                    )}
                                    onSelect={() => {
                                      if (
                                        !selectedIngredientIds.includes(item.id)
                                      ) {
                                        form.setValue(
                                          `ingredients.${index}.inventoryId`,
                                          item.id
                                        );
                                      }
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        item.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {item.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`ingredients.${index}.quantityUsed`}
                    render={({ field }) => (
                      <FormItem className="flex-grow w-full">
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="Quantity"
                            disabled={loading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2"
                  size="icon"
                  onClick={() => remove(index)}
                  disabled={loading}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => append({ inventoryId: "", quantityUsed: 1 })}
              disabled={loading}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Ingredient
            </Button>
          </div>

          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
