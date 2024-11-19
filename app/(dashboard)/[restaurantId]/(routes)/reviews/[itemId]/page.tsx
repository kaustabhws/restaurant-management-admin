import prismadb from "@/lib/prismadb";
import ItemReviewCard from "./components/item-review";

const MenuItemReviewPage = async ({
  params,
}: {
  params: { restaurantId: string; itemId: string };
}) => {
  const itemReviews = await prismadb.menu.findUnique({
    where: {
      id: params.itemId,
    },
    include: {
      reviews: {
        include: {
            customer: true,
        }
      }
    },
  });

  const currency = await prismadb.restaurants.findUnique({
    where: {
      id: params.restaurantId,
    }
  })

  // Check if itemReviews is null
  if (!itemReviews || !currency) {
    return <div>Menu item not found.</div>;
  }

  return (
    <div>
      <ItemReviewCard itemReviews={itemReviews} currency={currency} />
    </div>
  );
};

export default MenuItemReviewPage;
