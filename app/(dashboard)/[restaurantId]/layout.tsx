import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { restaurantId: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
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

  return {
    title: `${restaurant?.name} | Dashboard`,
  };
}

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

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
