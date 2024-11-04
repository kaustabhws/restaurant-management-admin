import prismadb from "@/lib/prismadb";
import { InventoryForm } from "./components/inventory-form";

const MenuPage = async ({
    params
}: {
    params: { inventoryId: string }
}) => {

    const inventoryItem = await prismadb.inventory.findUnique({
        where: {
            id: params.inventoryId
        }
    })

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-4 max-[425px]:px-3">
                <InventoryForm initialData={inventoryItem} />
            </div>
        </div>
    )
}

export default MenuPage;