import prismadb from "@/lib/prismadb";
import { ReservationClient } from "./components/client";

const ReservationPage = async ({
  params,
}: {
  params: { restaurantId: string };
}) => {
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
