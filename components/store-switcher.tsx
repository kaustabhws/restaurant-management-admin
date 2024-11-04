"use client";

import { Restaurants } from "@prisma/client";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useRestaurantModal } from "@/hooks/use-restautant-modal";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { Check, ChevronsUpDown, PlusCircle, Store as StoreIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface StoreSwitcherProps extends PopoverTriggerProps {
  items: Restaurants[];
}

export default function StoreSwitcher({
  className,
  items = [],
}: StoreSwitcherProps) {
  const restaurantModal = useRestaurantModal();
  const params = useParams();
  const router = useRouter();

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const currentRestaurant = formattedItems.find(
    (item) => item.value === params.restaurantId
  );

  const [open, setOpen] = useState(false);

  const onRestaurantSelect = (restaurant: { value: string; label: string }) => {
    setOpen(false);
    router.push(`/${restaurant.value}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a restaurant"
          className={cn("w-[200px] justify-between max-[371px]:w-auto", className)}
        >
          <StoreIcon className="mr-2 h-4 w-4" />
          {currentRestaurant?.label}
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search store..." />
            <CommandEmpty>No store found.</CommandEmpty>
            <CommandGroup heading="Stores">
              {formattedItems.map((restaurant) => (
                <CommandItem
                  key={restaurant.value}
                  onSelect={() => onRestaurantSelect(restaurant)}
                  className="text-sm"
                >
                  <StoreIcon className="mr-2 h-4 w-4" />
                  {restaurant.label}
                  <Check 
                    className={cn(
                      'ml-auto h4 w-4',
                      currentRestaurant?.value === restaurant.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  restaurantModal.onOpen();
                }}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Restaurant
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
