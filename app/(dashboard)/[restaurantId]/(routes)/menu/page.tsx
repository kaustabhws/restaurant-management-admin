import { format } from 'date-fns'
import prismadb from "@/lib/prismadb";
import { MenuClient } from "./components/client";
import { MenuColumn } from "./components/columns";

const MenusPage = async ({
    params
}: {
    params: { restaurantId: string }
}) => {

    const menus = await prismadb.menu.findMany({
        where : {
            resId: params.restaurantId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedMenu: MenuColumn[] = menus.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        createdAt: format(item.createdAt, 'MMMM do, yyyy')
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <MenuClient data={formattedMenu} />
            </div>
        </div>
    )
}

export default MenusPage;