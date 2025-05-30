import prismadb from "@/lib/prismadb";
import { KdsClient } from "./components/client";
import { auth } from "@clerk/nextjs";
import { hasPermission } from "@/utils/has-permissions";
import AccessDenied from "@/components/access-denied";

const KdsPage = async ({ params }: { params: { restaurantId: string } }) => {
  const { userId } = auth();

  const hasAccess = await hasPermission(userId!, "ViewKDS");

  if (!hasAccess) {
    return <AccessDenied url={`/${params.restaurantId}`} />;
  }

  const kds = await prismadb.kDSOrder.findMany({
    where: {
      resId: params.restaurantId,
      createdAt: {
        gte: new Date(new Date().setUTCHours(0, 0, 0, 0)),
        lte: new Date(new Date().setUTCHours(23, 59, 59, 999)),
      },
    },
    include: {
      items: true,
    },
  });

  const ordersServed = await prismadb.orders.count({
    where: {
      resId: params.restaurantId,
      status: "Fulfilled",
      createdAt: {
        gte: new Date(new Date().setUTCHours(0, 0, 0, 0)),
        lte: new Date(new Date().setUTCHours(23, 59, 59, 999)),
      },
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6 max-[425px]:px-3">
        <KdsClient
          data={kds}
          resId={params.restaurantId}
          ordersServed={ordersServed}
        />
      </div>
    </div>
  );
};

export default KdsPage;
