import prismadb from "@/lib/prismadb";
import Image from "next/image";
import tablesvg from "../../../../../assets/table.svg";
import { CellAction } from "./components/cell-action";
import Link from "next/link";

const TablesOverviewPage = async ({
  params,
}: {
  params: { restaurantId: string };
}) => {
  const tables = await prismadb.table.findMany({
    where: {
      resId: params.restaurantId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <div className="p-8 pt-6">
      <div className="flex space-x-2">
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"></div>
          <span className="text-xs">Available</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center"></div>
          <span className="text-xs">Occupied</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center"></div>
          <span className="text-xs">Reserved</span>
        </div>
      </div>
      <div className="flex gap-16 mt-6 flex-wrap">
        {tables.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center mt-10">
            <p className='text-lg'>No tables found</p>
            <Link href={`/${params.restaurantId}/tables/new`} className='text-sm text-blue-600'>Click here to add</Link>
          </div>
        )}
        {tables.map((table: any) => (
          <div key={table.id} className="relative flex flex-col items-center">
            <Image src={tablesvg} alt={table.name} height={120} />
            <div
              className={`absolute top-[46px] w-6 h-6 rounded-full flex items-center justify-center
            ${
              table.status === "Available"
                ? "bg-green-500"
                : table.status === "Occupied"
                ? "bg-red-500"
                : "bg-yellow-500"
            }`}
            ></div>
            <p>{table.name}</p>
            <CellAction data={table} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TablesOverviewPage;
