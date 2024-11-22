import prismadb from "@/lib/prismadb";
import { ExpenseForm } from "./components/expense-form";

const ExpenseItemPage = async ({
  params,
}: {
  params: { expenseId: string; restaurantId: string };
}) => {
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
