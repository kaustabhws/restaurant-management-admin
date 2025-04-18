"use client";

import { cn } from "@/lib/utils";
import { useParams, usePathname } from "next/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  LucideIcon,
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
  Layers,
  BadgePercent,
  MessageCircleMore,
  ChartNoAxesCombined,
  CookingPot,
} from "lucide-react";
import Link from "next/link";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();

  const navGroups: NavGroup[] = [
    {
      label: "Dashboard",
      items: [
        {
          href: `/${params.restaurantId}`,
          label: "Overview",
          icon: LayoutDashboard,
        },
        {
          href: `/${params.restaurantId}/expenses`,
          label: "Expenses",
          icon: ChartNoAxesCombined,
        },
      ],
    },
    {
      label: "Management",
      items: [
        {
          href: `/${params.restaurantId}/inventory`,
          label: "Inventory",
          icon: Layers,
        },
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
        {
          href: `/${params.restaurantId}/campaigns`,
          label: "Campaigns",
          icon: BadgePercent,
        },
        {
          href: `/${params.restaurantId}/kds`,
          label: "Kitchen Display",
          icon: CookingPot,
        },
      ],
    },
    {
      label: "Orders",
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
        {
          href: `/${params.restaurantId}/sales-report`,
          label: "Sales Report",
          icon: BadgeCheck,
        },
      ],
    },
    {
      label: "Customers",
      items: [
        {
          href: `/${params.restaurantId}/customers`,
          label: "Customers",
          icon: Users,
        },
        {
          href: `/${params.restaurantId}/reviews`,
          label: "Reviews",
          icon: MessageCircleMore,
        },
      ],
    },
    {
      label: "Settings",
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
    <NavigationMenu
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
    >
      <NavigationMenuList>
        {navGroups.map((group) => (
          <NavigationMenuItem key={group.label}>
            <NavigationMenuTrigger className="px-2">
              {group.label}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                          pathname === item.href
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <div className="text-sm font-medium leading-none">
                            {item.label}
                          </div>
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          {getItemDescription(item.label)}
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function getItemDescription(label: string): string {
  switch (label) {
    case "Overview":
      return "General overview of the restaurant's operations.";
    case "Expenses":
      return "View and manage expenses.";
    case "Inventory":
      return "Manage inventory items.";
    case "Menu":
      return "Manage menu items.";
    case "Tables":
      return "Manage tables.";
    case "Tables Overview":
      return "View table statuses and availability.";
    case "Reservation":
      return "Manage reservations.";
    case "Campaigns":
      return "Manage promotion campaigns.";
    case "Kitchen Display":
      return "Manage kitchen display";
    case "Order":
      return "Manage and track orders.";
    case "Insights":
      return "View detailed insights on performance.";
    case "Statistics":
      return "Sales, revenue, and other key metrics.";
    case "Sales Report":
      return "View detailed sales reports.";
    case "Customers":
      return "Manage customer information and loyalty programs.";
    case "Reviews":
      return "View and manage customer reviews.";
    case "Settings":
      return "Configure system settings.";
    default:
      return "";
  }
}
