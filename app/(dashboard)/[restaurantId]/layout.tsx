import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

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
