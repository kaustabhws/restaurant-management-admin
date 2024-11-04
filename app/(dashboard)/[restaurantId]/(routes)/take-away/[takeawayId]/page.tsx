import prismadb from "@/lib/prismadb";
import { TableForm } from "./components/table-form";

interface TakeAwayPageProps {
  params: {
    restaurantId: string;
    takeawayId: string;
  };
}

const TakeAwayPage: React.FC<TakeAwayPageProps> = async ({ params }) => {
  const menu = await prismadb.menu.findMany({
    where: {
      resId: params.restaurantId,
    },
    include: {
      ingredients: true,
    },
  });

  const inventory = await prismadb.inventory.findMany({
    where: {
      resId: params.restaurantId,
    },
  });

  const tempOrder = await prismadb.tempOrders.findMany({
    where: {
      takeawayId: params.takeawayId,
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
          takeAwayId={params.takeawayId}
          menu={menu}
          temporder={tempOrder}
          inventory={inventory}
        />
      </div>
    </div>
  );
};

export default TakeAwayPage;
