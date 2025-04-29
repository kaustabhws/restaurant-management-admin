import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { CustiomerClient } from "./components/client";
import { CustomerColumn } from "./components/columns";
import { getISTTime } from "@/lib/getISTTime";
import { auth } from "@clerk/nextjs";
import { hasPermission } from "@/utils/has-permissions";
import AccessDenied from "@/components/access-denied";

const CustomersPage = async ({
  params,
}: {
  params: { restaurantId: string };
}) => {
  const { userId } = auth();

  const hasAccess = await hasPermission(userId!, "ViewCustomers");

  if (!hasAccess) {
    return <AccessDenied url={`/${params.restaurantId}`} />;
  }

  const customers = await prismadb.customer.findMany({
    where: {
      resId: params.restaurantId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedMenu: CustomerColumn[] = customers.map((item) => ({
    id: item.id,
    contact: item.phone ?? item.email ?? "No contact",
    loyaltyPoints: item.loyaltyPoints,
    totalSpent: item.totalSpent,
    createdAt: format(getISTTime(item.createdAt), "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6 max-[425px]:px-3">
        <CustiomerClient data={formattedMenu} />
      </div>
    </div>
  );
};

export default CustomersPage;
