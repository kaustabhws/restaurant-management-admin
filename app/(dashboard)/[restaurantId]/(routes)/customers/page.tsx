import { format } from 'date-fns'
import prismadb from "@/lib/prismadb";
import { CustiomerClient } from "./components/client";
import { CustomerColumn } from "./components/columns";

const MenusPage = async ({
    params
}: {
    params: { restaurantId: string }
}) => {

    const customers = await prismadb.customer.findMany({
        where : {
            resId: params.restaurantId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const formattedMenu: CustomerColumn[] = customers.map((item) => ({
        id: item.id,
        contact: item.phone ?? item.email ?? 'No contact',
        loyaltyPoints: item.loyaltyPoints,
        totalSpent: item.totalSpent,
        createdAt: format(item.createdAt, 'MMMM do, yyyy')
    }));

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6 max-[425px]:px-3">
                <CustiomerClient data={formattedMenu} />
            </div>
        </div>
    )
}

export default MenusPage;