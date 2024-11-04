import prismadb from "@/lib/prismadb";
import { InventoryColumn } from "./components/columns";
import { format } from "date-fns";
import { getISTTime } from "@/lib/getISTTime";
import { InventoryClient } from "./components/client";

const InventoryPage = async ({
  params,
}: {
  params: { restaurantId: string };
}) => {
  const inventory = await prismadb.inventory.findMany({
    where: {
      resId: params.restaurantId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedInventory: InventoryColumn[] = inventory.map((item) => ({
    id: item.id,
    name: item.name,
    price: `${item.price}/${item.unit}`,
    quantity: `${item.availableQuantity} ${item.unit}`,
    status:
      item.availableQuantity > item.minStockThreshold
        ? "In Stock"
        : "Low Stock",
    createdAt: format(getISTTime(item.createdAt), "MMMM do, yyyy"),
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
