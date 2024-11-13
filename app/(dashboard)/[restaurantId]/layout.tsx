import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";
import { Modal } from "@/components/ui/modal";
import { LowStockModal } from "@/components/modals/low-stock-alert";

type Props = {
  params: { restaurantId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { restaurantId: string };
}) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const restaurant = await prismadb.restaurants.findFirst({
    where: {
      id: params.restaurantId,
      userId,
    },
  });

  if (!restaurant) {
    redirect("/");
  }

  const inventory = await prismadb.inventory.findMany({
    where: {
      resId: restaurant.id,
    },
  });

  // Filter for low-stock items
  const lowStockItems = inventory.filter(
    (item) => item.availableQuantity < item.minStockThreshold
  );

  return (
    <>
      <Navbar resId={restaurant.id} lowStockItems={lowStockItems} />
      {children}
      <LowStockModal items={lowStockItems} />
    </>
  );
}
