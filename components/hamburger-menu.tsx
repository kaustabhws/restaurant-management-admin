"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MainNav } from "./main-nav";
import { useState } from "react";
import StoreSwitcher from "./store-switcher";

export function Hammburger({ restaurant }: { restaurant: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="relative group">
          <div className="relative flex items-center justify-center rounded-full w-[50px] h-[50px] transform transition-all border ring-0 ring-gray-300 hover:ring-8 ring-opacity-30 duration-200 shadow-md">
            <div className="flex flex-col justify-between w-[20px] h-[20px]">
              <div className="bg-white h-[2px] w-1/2 rounded"></div>
              <div className="bg-white h-[1px] rounded"></div>
              <div className="bg-white h-[2px] w-1/2 rounded self-end"></div>
            </div>
          </div>
        </button>
      </SheetTrigger>
      <SheetContent side="left">
        <div className="mt-10 flex justify-center">
          <MainNav
            className="flex-col gap-5 items-start space-x-0 text-xl"
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
