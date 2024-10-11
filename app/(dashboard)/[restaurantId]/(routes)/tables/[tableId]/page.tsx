import prismadb from "@/lib/prismadb";
import { TableForm } from "./components/table-form";

const MenuPage = async ({
    params
}: {
    params: { tableId: string }
}) => {

    const table = await prismadb.table.findUnique({
        where: {
            id: params.tableId
        }
    })

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-4 max-[425px]:px-3">
                <TableForm initialData={table} />
            </div>
        </div>
    )
}

export default MenuPage;