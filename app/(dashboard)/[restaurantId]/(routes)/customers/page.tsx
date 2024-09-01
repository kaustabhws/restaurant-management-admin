import { format } from 'date-fns'
import prismadb from "@/lib/prismadb";
import { MenuClient } from "./components/client";
import { CustomerColumn } from "./components/columns";

const MenusPage = async ({
    params
}: {
    params: { customerId: string }
}) => {

    const customers = await prismadb.customer.findMany({
        where : {
            id: params.customerId
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
                <MenuClient data={formattedMenu} />
            </div>
        </div>
    )
}

export default MenusPage;