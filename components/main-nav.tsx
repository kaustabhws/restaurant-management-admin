"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export function MainNav({
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

  const routes = [
    {
      href: `/${params.restaurantId}`,
      label: "Overview",
      active: pathname === `/${params.restaurantId}`,
    },
    {
      href: `/${params.restaurantId}/menu`,
      label: "Menu",
      active: pathname === `/${params.restaurantId}/menu`,
    },
    {
      href: `/${params.restaurantId}/tables`,
      label: "Tables",
      active: pathname === `/${params.restaurantId}/tables`,
    },
    {
      href: `/${params.restaurantId}/tables-overview`,
      label: "Tables Overview",
      active: pathname === `/${params.restaurantId}/tables-overview`,
    },
    {
      href: `/${params.restaurantId}/orders`,
      label: "Order",
      active: pathname === `/${params.restaurantId}/orders`,
    },
    {
      href: `/${params.restaurantId}/settings`,
      label: "Settings",
      active: pathname === `/${params.restaurantId}/settings`,
    },
    {
      href: `/${params.restaurantId}/insights`,
      label: "Insights",
      active: pathname === `/${params.restaurantId}/insights`,
    },
  ];

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6 text-sm", className)}>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "font-medium transition-colors hover:text-primary",
            route.active
              ? "text-black font-semibold dark:text-white"
              : "text-muted-foreground"
          )}
          onClick={() => {
            if (setIsOpen) {
              setIsOpen(!isOpen);
            }
          }}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
