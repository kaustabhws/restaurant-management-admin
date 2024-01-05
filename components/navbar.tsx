import { UserButton, auth } from "@clerk/nextjs";
import { MainNav } from "./main-nav";
import StoreSwitcher from "./store-switcher";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { ThemeToggle } from "./theme-toggle";

const Navbar = async () => {

    const { userId } = auth()

    if(!userId) {
        redirect('/sign-in')
    }

    const restaurant = await prismadb.restaurants.findMany({
        where: {
            userId
        },
    })

    return (
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
                <StoreSwitcher items={restaurant} />
                <MainNav className="mx-6" />
                <div className="ml-auto flex items-center space-x-4">
                    <ThemeToggle />
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>
        </div>
    )
}

export default Navbar;