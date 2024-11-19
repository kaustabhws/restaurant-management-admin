import prismadb from "@/lib/prismadb";
import { TransactionColumn } from "./components/loyalty-columns";
import { format } from "date-fns";
import { TransactionClient } from "./components/transaction-client";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, StarIcon, UserIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderHistoryColumn } from "./components/order-history-column";
import { OrderClient } from "./components/order-history-client";
import { getCurrencyIcon } from "@/lib/getCurrenctIcon";

const CustomerPage = async ({
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

  const currency = await prismadb.restaurants.findUnique({
    where: {
      id: params.restaurantId,
    }
  })

  if (!customer || !currency) {
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

  const formattedOrders: OrderHistoryColumn[] = customer.orders.map((order) => {
    return {
      id: order.id,
      orderSlNo: `#${order.slNo}`,
      isPaid: order.isPaid ? "Paid" : "Unpaid",
      orderValue: order.amount,
      createdAt: format(new Date(order.createdAt), "MMMM do, yyyy"),
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-4 max-[425px]:px-3">
        <div className="flex items-center justify-between">
          <Card className="shadow-lg max-[650px]:flex-1">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary">
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <UserIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Contact
                    </p>
                    <p className="text-lg font-semibold">
                      {customer.phone || customer.email || "No contact"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <StarIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Loyalty Points
                    </p>
                    <p className="text-lg font-semibold">
                      {customer.loyaltyPoints}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    {getCurrencyIcon({ currency: currency.currency, className: "h-6 w-6 text-primary" })}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Spend
                    </p>
                    <p className="text-lg font-semibold">
                      {customer.totalSpent}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Separator />
        <Tabs defaultValue="orderHistory">
          <TabsList
            className="flex-row justify-start max-[350px]:flex-col max-[350px]:h-full max-[350px]:w-full"
          >
            <TabsTrigger
              value="orderHistory"
              className="max-[350px]:w-full"
            >
              Order History
            </TabsTrigger>
            <TabsTrigger
              value="transactionHistory"
              className="max-[350px]:w-full"
            >
              Loyalty Transactions
            </TabsTrigger>
          </TabsList>
          <TabsContent value="orderHistory" className="w-full">
            <OrderClient data={formattedOrders} />
          </TabsContent>
          <TabsContent value="transactionHistory" className="w-full">
            <TransactionClient data={formattedTransactions} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerPage;
