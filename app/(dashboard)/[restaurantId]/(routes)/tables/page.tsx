import { format } from 'date-fns'
import prismadb from "@/lib/prismadb";
import { TableClient } from "./components/client";
import { TableColumn } from "./components/columns";

const TablePage = async ({
    params
}: {
    params: { restaurantId: string }
}) => {

    const tables = await prismadb.table.findMany({
        where : {
            resId: params.restaurantId
        },
        orderBy: {
            createdAt: 'asc'
        }
    });

    const formattedMenu: TableColumn[] = tables.map((table) => ({
        id: table.id,
        name: table.name,
        seats: table.seats,
        status: table.status,
        createdAt: format(table.createdAt, 'MMMM do, yyyy')
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6 max-[425px]:px-3">
                <TableClient data={formattedMenu} />
            </div>
        </div>
    )
}

export default TablePage;