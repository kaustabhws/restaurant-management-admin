import prismadb from "@/lib/prismadb";
import { ReservationForm } from "./components/reservation-form";

const ReservationIdPage = async ({
  params,
}: {
  params: { reservationId: string; restaurantId: string };
}) => {
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

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-4 max-[425px]:px-3">
        <ReservationForm initialData={reservation} tables={tables} />
      </div>
    </div>
  );
};

export default ReservationIdPage;
