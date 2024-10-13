import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { TableClient } from "./components/client";
import { TableColumn } from "./components/columns";

const TablePage = async ({ params }: { params: { restaurantId: string } }) => {
  // Get current date for comparison
  const currentDate = new Date();
  const formattedDate = format(currentDate, "yyyy-MM-dd"); // Keep in YYYY-MM-DD format for comparison

  const tables = await prismadb.table.findMany({
    where: {
      resId: params.restaurantId,
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      reservation: true
    },
  });

  const formattedMenu: TableColumn[] = tables.map((table) => {
    // Check if any reservation date matches the current date
    const hasReservationToday = table.reservation.some(
      (reservation) =>
        format(reservation.date, "yyyy-MM-dd") === formattedDate &&
        reservation.status === "Upcoming"
    );

    // Set status to 'Reserved' if there's a reservation today, otherwise keep original status
    const tableStatus = hasReservationToday ? "Reserved" : table.status;

    return {
      id: table.id,
      name: table.name,
      seats: table.seats,
      status: tableStatus,
      createdAt: format(table.createdAt, "MMMM do, yyyy"),
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6 max-[425px]:px-3">
        <TableClient data={formattedMenu} />
      </div>
    </div>
  );
};

export default TablePage;
