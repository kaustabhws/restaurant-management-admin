import prismadb from "@/lib/prismadb";
import { InventoryColumn } from "./components/columns";
import { format } from "date-fns";
import { getISTTime } from "@/lib/getISTTime";
import { InventoryClient } from "./components/client";
import { auth } from "@clerk/nextjs";
import { hasPermission } from "@/utils/has-permissions";
import AccessDenied from "@/components/access-denied";

const InventoryPage = async ({
  params,
}: {
  params: { restaurantId: string };
}) => {

  const { userId } = auth()

  const hasAccess = await hasPermission(userId!, "ViewInventory")

  if(!hasAccess) {
    return (
      <AccessDenied url={`/${params.restaurantId}`} />
    )
  }

  const inventory = await prismadb.inventory.findMany({
    where: {
      resId: params.restaurantId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      restaurant: true,
    },
  });

  const formattedInventory: InventoryColumn[] = inventory.map((item) => ({
    id: item.id,
    name: item.name,
    price: `${item.price}/${item.unit}`,
    availableQuantity: `${item.availableQuantity} ${item.unit}`,
    minStockThreshold: item.minStockThreshold,
    unit: item.unit,
    currency: item.restaurant.currency,
    status:
      item.availableQuantity > item.minStockThreshold
        ? "In Stock"
        : "Low Stock",
    createdAt: format(getISTTime(item.createdAt), "MMMM do, yyyy"),
    lastRestockedAt: item.lastRestockedAt
      ? format(getISTTime(item.lastRestockedAt), "MMMM do, yyyy")
      : "Never",
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6 max-[425px]:px-3">
        <InventoryClient data={formattedInventory} />
      </div>
    </div>
  );
};

export default InventoryPage;
