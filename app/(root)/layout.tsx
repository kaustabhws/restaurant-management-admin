import prismadb from "@/lib/prismadb";
import { auth, currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();
  const userclerk = await currentUser();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prismadb.user.findUnique({
    where: {
      email: userclerk?.emailAddresses[0].emailAddress,
    },
  });

  if (user) {
    const restaurant = await prismadb.restaurants.findFirst({
      where: {
        id: user.resId,
      },
    });

    if (restaurant) {
      await prismadb.user.update({
        where: {
          email: userclerk?.emailAddresses[0].emailAddress,
        },
        data: {
          clerkId: userId,
        },
      });
      redirect(`/${restaurant.id}`);
    }
  }

  const restaurant = await prismadb.restaurants.findFirst({
    where: {
      userId,
    },
  });

  if (restaurant) {
    redirect(`/${restaurant.id}`);
  }

  return <>{children}</>;
}
