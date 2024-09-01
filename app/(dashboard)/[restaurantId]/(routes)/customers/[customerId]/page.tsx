import prismadb from "@/lib/prismadb";
import { MenuForm } from "./components/menu-form";

const MenuPage = async ({
    params
}: {
    params: { menuId: string }
}) => {

    const menu = await prismadb.menu.findUnique({
        where: {
            id: params.menuId
        }
    })

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-4">
                <MenuForm initialData={menu} />
            </div>
        </div>
    )
}

export default MenuPage;