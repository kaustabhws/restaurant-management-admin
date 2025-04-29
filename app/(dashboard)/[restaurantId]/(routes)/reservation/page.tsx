import prismadb from "@/lib/prismadb";
import { ReservationClient } from "./components/client";
import { auth } from "@clerk/nextjs";
import { hasPermission } from "@/utils/has-permissions";
import AccessDenied from "@/components/access-denied";

const ReservationPage = async ({
  params,
}: {
  params: { restaurantId: string };
}) => {

  const { userId } = auth()

  const hasAccess = await hasPermission(userId!, "ManageReservations")

  if(!hasAccess) {
    return (
      <AccessDenied url={`/${params.restaurantId}`} />
    )
  }

  const reservations = await prismadb.reservation.findMany({
    where: {
      resId: params.restaurantId,
    },
    orderBy: {
      date: "asc",
    },
    include: {
      table: true,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6 max-[425px]:px-3">
        <ReservationClient data={reservations} />
      </div>
    </div>
  );
};

export default ReservationPage;
