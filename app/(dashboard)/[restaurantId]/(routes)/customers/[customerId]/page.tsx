import prismadb from "@/lib/prismadb";
import { TransactionColumn } from "./components/columns";
import { format } from "date-fns";
import { TransactionClient } from "./components/client";
import { redirect } from "next/navigation";

const MenuPage = async ({
  params,
}: {
  params: { customerId: string; restaurantId: string };
}) => {
  const customer = await prismadb.customer.findUnique({
    where: {
      id: params.customerId,
      resId: params.restaurantId,
    },
    include: {
      LoyaltyTransaction: {
        orderBy: {
          createdAt: "desc",
        },
      },
      orders: true,
      bills: true,
    },
  });

  if (!customer) {
    redirect(`/${params.restaurantId}/customers`);
  }

  const formattedTransactions: TransactionColumn[] =
    customer.LoyaltyTransaction.map((transaction) => {
      const transactionAmount =
        transaction.type === "Earned"
          ? `+${transaction.amount}` // Add "+" sign for "Earned"
          : `-${transaction.amount}`; // Add "-" sign for "Redeemed"

      return {
        id: transaction.id,
        type: transaction.type,
        totalLoyaltyPoints: customer.loyaltyPoints,
        transaction: transactionAmount,
        description: transaction.description,
        createdAt: format(new Date(transaction.createdAt), "MMMM do, yyyy"),
      };
    });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-4 max-[425px]:px-3">
        <TransactionClient
          data={formattedTransactions}
          contact={customer.phone || customer.email || "No contact"}
          loyaltyPoints={customer.loyaltyPoints}
        />
      </div>
    </div>
  );
};

export default MenuPage;
