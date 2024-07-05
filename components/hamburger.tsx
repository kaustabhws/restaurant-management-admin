"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MainNav } from "./main-nav";
import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
          <button className="relative group">
            <div className="relative flex items-center justify-center rounded-full w-[50px] h-[50px] ring-0 ring-gray-400 hover:ring-8  ring-opacity-30 duration-200 shadow-md max-[340px]:w-[40px] max-[340px]:h-[40px]">
              <div className="flex flex-col justify-between w-[20px] h-[20px]">
                <div
                  className="dark:bg-white bg-black h-[2px] w-1/2 rounded"
                ></div>
                <div className="dark:bg-white bg-black h-[1px] rounded"></div>
                <div
                  className="dark:bg-white bg-black h-[2px] w-1/2 rounded self-end"
                ></div>
              </div>
            </div>
          </button>
      </SheetTrigger>
      <SheetContent side="left" className="px-10 max-w-[400px]">
        <MainNav
          className="flex-col gap-6 space-x-0 text-lg items-start"
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </SheetContent>
    </Sheet>
  );
};

export default HamburgerMenu;
