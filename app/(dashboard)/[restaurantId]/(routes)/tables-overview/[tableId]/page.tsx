import prismadb from "@/lib/prismadb";
import { TableForm } from "./components/table-form";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
import { hasPermission } from "@/utils/has-permissions";
import AccessDenied from "@/components/access-denied";

const MenuPage = async ({
  params,
}: {
  params: { tableId: string; restaurantId: string };
}) => {

  const { userId } = auth()
  
  const hasAccess = await hasPermission(userId!, "CreateOrders");

  if(!hasAccess) {
    return (
      <AccessDenied url={`/${params.restaurantId}`} />
    )
  }

  const table = await prismadb.table.findUnique({
    where: {
      id: params.tableId,
    },
  });

  if (!table) {
    redirect(`/${params.restaurantId}/tables-overview`);
  }

  const menu = await prismadb.menu.findMany({
    where: {
      resId: params.restaurantId,
    },
    include: {
      ingredients: true,
      images: true,
    },
  });

  const inventory = await prismadb.inventory.findMany({
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
      <div className="flex-1 space-y-4 p-8 pt-4 max-[425px]:px-3">
        <TableForm
          table={table}
          menu={menu}
          inventory={inventory}
          temporder={tempOrder}
        />
      </div>
    </div>
  );
};

export default MenuPage;
