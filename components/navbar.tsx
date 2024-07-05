import { UserButton, auth } from "@clerk/nextjs";
import { MainNav } from "./main-nav";
import StoreSwitcher from "./store-switcher";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { ThemeToggle } from "./theme-toggle";
import HamburgerMenu from "./hamburger";

const Navbar = async () => {
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
      <div className="flex h-16 items-center px-4 max-[400px]:px-1">
        <div className="min-[900px]:hidden">
          <HamburgerMenu />
        </div>
        <div className="flex max-[900px]:flex-1 justify-center max-[900px]:justify-center">
          <StoreSwitcher items={restaurant} />
        </div>
        <MainNav className="mx-6 max-[900px]:hidden" />
        <div className="ml-auto flex items-center space-x-4 max-[400px]:space-x-2">
          <ThemeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
