import { UserButton, auth } from "@clerk/nextjs";
import { MainNav } from "./main-nav";
import StoreSwitcher from "./store-switcher";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { ThemeToggle } from "./theme-toggle";
import HamburgerMenu from "./hamburger";
import Notification from "./notifications";
import { Currency, Inventory } from "@prisma/client";
import { TriangleAlert } from "lucide-react";
import LowStockAlertButton from "./ui/low-alert-btn";

interface NavbarProps {
  resId: string;
  lowStockItems: Inventory[];
  currency: Currency;
}

const Navbar: React.FC<NavbarProps> = async ({
  resId,
  lowStockItems,
  currency,
}) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const restaurant = await prismadb.restaurants.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-3 max-[426px]:px-1">
        <div className="min-[1168px]:hidden">
          <HamburgerMenu restaurant={restaurant} />
        </div>
        <div className="flex max-[1168px]:flex-1 justify-center max-[900px]:justify-center max-[500px]:hidden">
          <StoreSwitcher items={restaurant} />
        </div>
        <MainNav className="min-[1100px]:mx-6 max-[1168px]:hidden max-[1100px]:mx-4" />
        <div className="ml-auto flex items-center space-x-4 max-[446px]:space-x-2">
          {lowStockItems.length > 0 && (
            <LowStockAlertButton
              lowStockItems={lowStockItems}
              currency={currency}
            />
          )}
          <Notification resId={resId} />
          <ThemeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
