import prismadb from "@/lib/prismadb";
import { ReviewClient } from "./components/client";

const RewviewsPage = async ({
  params,
}: {
  params: { restaurantId: string };
}) => {
  const reviews = await prismadb.menu.findMany({
    where: {
      resId: params.restaurantId,
    },
    include: {
      reviews: true,
    },
  });

  const customer = await prismadb.customer.findMany({
    where: {
      resId: params.restaurantId,
    },
  })
  
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6 max-[425px]:px-3">
        <ReviewClient data={reviews} customer={customer} />
      </div>
    </div>
  );
};

export default RewviewsPage;
