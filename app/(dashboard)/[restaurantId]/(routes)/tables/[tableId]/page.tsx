import prismadb from "@/lib/prismadb";
import { TableForm } from "./components/table-form";
import { auth } from "@clerk/nextjs";
import { hasPermission } from "@/utils/has-permissions";
import AccessDenied from "@/components/access-denied";

const MenuPage = async ({
  params,
}: {
  params: { tableId: string; restaurantId: string };
}) => {
  const { userId } = auth();

  const hasAccess =
    (await hasPermission(userId!, "CreateTables")) ||
    (await hasPermission(userId!, "UpdateTables"));

  if (!hasAccess) {
    return <AccessDenied url={`/${params.restaurantId}`} />;
  }

  const table = await prismadb.table.findUnique({
    where: {
      id: params.tableId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-4 max-[425px]:px-3">
        <TableForm initialData={table} />
      </div>
    </div>
  );
};

export default MenuPage;
