import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { ReservationClient } from "./components/client";
// import { MenuClient } from "./components/client";
// import { MenuColumn } from "./components/columns";

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
      createdAt: "desc",
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
