import prismadb from "@/lib/prismadb";
import { TableForm } from "./components/table-form";

const MenuPage = async ({
  params,
}: {
  params: { tableId: string; restaurantId: string };
}) => {
  const table = await prismadb.table.findUnique({
    where: {
      id: params.tableId,
    },
  });

  const menu = await prismadb.menu.findMany({
    where: {
      resId: params.restaurantId,
    },
  });

  const tempOrder = await prismadb.tempOrders.findMany({
    where: {
      tableId: table?.id,
    },
    include: {
      orderItems: {
        include: {
          menuItem: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-4">
        <TableForm table={table} menu={menu} temporder={tempOrder} />
      </div>
    </div>
  );
};

export default MenuPage;
