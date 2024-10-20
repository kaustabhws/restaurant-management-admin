"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LucideIcon,
  Menu,
  LayoutDashboard,
  Utensils,
  Table,
  ClipboardList,
  PieChart,
  BarChart,
  Users,
  Settings,
  BadgeCheck,
  UserRoundCheck,
  CalendarCheck,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

type NavGroup = {
  label: string;
  icon: LucideIcon;
  items: NavItem[];
};

export function MobileMainNav({
  className,
  isOpen,
  setIsOpen,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  isOpen?: boolean;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const pathname = usePathname();
  const params = useParams();
  const [open, setOpen] = useState(false);

  const navGroups: NavGroup[] = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      items: [
        {
          href: `/${params.restaurantId}`,
          label: "Overview",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      label: "Management",
      icon: Utensils,
      items: [
        { href: `/${params.restaurantId}/menu`, label: "Menu", icon: Utensils },
        {
          href: `/${params.restaurantId}/tables`,
          label: "Tables",
          icon: Table,
        },
        {
          href: `/${params.restaurantId}/tables-overview`,
          label: "Tables Overview",
          icon: Table,
        },
        {
          href: `/${params.restaurantId}/reservation`,
          label: "Reservation",
          icon: CalendarCheck,
        },
      ],
    },
    {
      label: "Orders",
      icon: ClipboardList,
      items: [
        {
          href: `/${params.restaurantId}/orders`,
          label: "Order",
          icon: ClipboardList,
        },
      ],
    },
    {
      label: "Analytics",
      icon: PieChart,
      items: [
        {
          href: `/${params.restaurantId}/insights`,
          label: "Insights",
          icon: PieChart,
        },
        {
          href: `/${params.restaurantId}/statistics`,
          label: "Statistics",
          icon: BarChart,
        },
      ],
    },
    {
      label: "Customers",
      icon: Users,
      items: [
        {
          href: `/${params.restaurantId}/customers`,
          label: "Customers",
          icon: Users,
        },
      ],
    },
    {
      label: "Settings",
      icon: Settings,
      items: [
        {
          href: `/${params.restaurantId}/settings/profile`,
          label: "Settings",
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col space-y-2">
      {navGroups.map((group) => (
        <div key={group.label} className="space-y-2">
          <h2 className="px-4 text-lg font-semibold tracking-tight">
            {group.label}
          </h2>
          {group.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                if (setIsOpen) {
                  setIsOpen(!isOpen);
                }
              }}
              className={cn(
                "flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
}
