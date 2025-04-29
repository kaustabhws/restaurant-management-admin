import prismadb from "@/lib/prismadb";
import { ExpenseForm } from "./components/expense-form";
import { hasPermission } from "@/utils/has-permissions";
import { auth } from "@clerk/nextjs";
import AccessDenied from "@/components/access-denied";

const ExpenseItemPage = async ({
  params,
}: {
  params: { expenseId: string; restaurantId: string };
}) => {

  const { userId } = auth()

  const hasAccess = await hasPermission(userId!, "ManageExpenses")

  if(!hasAccess) {
    return (
      <AccessDenied url={`/${params.restaurantId}`} />
    )
  }

  const expenseItem = await prismadb.expense.findUnique({
    where: {
      id: params.expenseId,
    },
  });

  const categories = await prismadb.expenseCategory.findMany({
    where: {
      resId: params.restaurantId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-4 max-[425px]:px-3">
        <ExpenseForm initialData={expenseItem} categories={categories} />
      </div>
    </div>
  );
};

export default ExpenseItemPage;
