import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ProfileForm } from "../components/profile-form"; 
import { SettingsForm } from "../components/settings-form";

interface ProfilePageProps {
  params: {
    restaurantId: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
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
    <div className="space-y-6">
      <SettingsForm initialData={restaurant} />
    </div>
  );
}
