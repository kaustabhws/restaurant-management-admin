import prismadb from "@/lib/prismadb";
import { InventoryForm } from "./components/inventory-form";
import { auth } from "@clerk/nextjs";
import { hasPermission } from "@/utils/has-permissions";
import AccessDenied from "@/components/access-denied";

const MenuPage = async ({
  params,
}: {
  params: { inventoryId: string; restaurantId: string };
}) => {
  const { userId } = auth();

  const hasAccess =
    (await hasPermission(userId!, "AddInventory")) ||
    (await hasPermission(userId!, "UpdateInventory"));

  if (!hasAccess) {
    return <AccessDenied url={`/${params.restaurantId}`} />;
  }

  const inventoryItem = await prismadb.inventory.findUnique({
    where: {
      id: params.inventoryId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-4 max-[425px]:px-3">
        <InventoryForm initialData={inventoryItem} />
      </div>
    </div>
  );
};

export default MenuPage;
