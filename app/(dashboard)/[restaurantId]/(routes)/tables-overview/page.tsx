import prismadb from "@/lib/prismadb";
import Image from "next/image";
import tablesvg from "../../../../../assets/table.svg";
import { CellAction } from "./components/cell-action";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import TableWithSeats from "@/components/table-with-seats";

const TablesOverviewPage = async ({
  params,
}: {
  params: { restaurantId: string };
}) => {
  const currentDate = new Date();
  const formattedDate = format(currentDate, "yyyy-MM-dd");

  const tables = await prismadb.table.findMany({
    where: {
      resId: params.restaurantId,
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      reservation: true,
    },
  });

  // Map through tables and determine the correct status based on reservations
  const formattedTables = tables.map((table) => {
    const hasReservationToday = table.reservation.some(
      (reservation) =>
        format(new Date(reservation.date), "yyyy-MM-dd") === formattedDate &&
        reservation.status === "Upcoming"
    );

    // Set status to "Reserved" if there's an upcoming reservation today
    const tableStatus = hasReservationToday ? "Reserved" : table.status;

    return {
      ...table, // Spread original table data
      status: tableStatus, // Override the status if needed
    };
  });

  return (
    <div className="p-8 pt-6">
      <div className="flex items-center justify-between max-[460px]:flex-col max-[460px]:items-start gap-5">
        <div className="flex space-x-2">
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 bg-[#4CAF50] rounded-full flex items-center justify-center"></div>
            <span className="text-xs">Available</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 bg-[#F44336] rounded-full flex items-center justify-center"></div>
            <span className="text-xs">Occupied</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 bg-[#FF9800] rounded-full flex items-center justify-center"></div>
            <span className="text-xs">Reserved</span>
          </div>
        </div>
        <div>
          <Link href={`/${params.restaurantId}/reservation`}>
            <Button>Create Reservation</Button>
          </Link>
        </div>
      </div>
      <div className="flex gap-10 mt-6 flex-wrap max-[430px]:justify-center">
        {formattedTables.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center mt-10">
            <p className="text-lg">No tables found</p>
            <Link
              href={`/${params.restaurantId}/tables/new`}
              className="text-sm text-blue-600"
            >
              Click here to add
            </Link>
          </div>
        )}
        {formattedTables.map((table: any) => (
          <div key={table.id} className="relative flex flex-col items-center">
            <TableWithSeats seats={table.seats} status={table.status} />
            <p>{table.name}</p>
            <CellAction data={table} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TablesOverviewPage;
