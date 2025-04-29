import prismadb from "@/lib/prismadb";
import { ReservationForm } from "./components/reservation-form";
import { auth } from "@clerk/nextjs";
import { hasPermission } from "@/utils/has-permissions";
import AccessDenied from "@/components/access-denied";

const ReservationIdPage = async ({
  params,
}: {
  params: { reservationId: string; restaurantId: string };
}) => {
  const { userId } = auth();

  const hasAccess = await hasPermission(userId!, "ManageReservations");

  if (!hasAccess) {
    return <AccessDenied url={`/${params.restaurantId}`} />;
  }

  const reservation = await prismadb.reservation.findUnique({
    where: {
      id: params.reservationId,
    },
  });

  const tables = await prismadb.table.findMany({
    where: {
      resId: params.restaurantId,
    },
  });

  const reservations = await prismadb.reservation.findMany({
    where: {
      resId: params.restaurantId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-4 max-[425px]:px-3">
        <ReservationForm
          initialData={reservation}
          tables={tables}
          reservations={reservations}
        />
      </div>
    </div>
  );
};

export default ReservationIdPage;
