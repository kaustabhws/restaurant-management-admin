import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { MenuClient } from "./components/client";
import { MenuColumn } from "./components/columns";
import { getISTTime } from "@/lib/getISTTime";
import { auth } from "@clerk/nextjs";
import { hasPermission } from "@/utils/has-permissions";
import Link from "next/link";
import AccessDenied from "@/components/access-denied";

const MenusPage = async ({ params }: { params: { restaurantId: string } }) => {
  const { userId } = auth();

  const hasAccess = await hasPermission(userId!, "ViewMenu");

  if (!hasAccess) {
    return (
      <AccessDenied url={`/${params.restaurantId}`} />
    );
  }

  const menus = await prismadb.menu.findMany({
    where: {
      resId: params.restaurantId,
    },
    include: {
      ingredients: true,
      reviews: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const inventory = await prismadb.inventory.findMany({
    where: {
      resId: params.restaurantId,
    },
  });

  const formattedMenu: MenuColumn[] = menus.map((item) => {
    // Determine stock status based on ingredients and inventory availability
    const outOfStock = item.ingredients.some((ingredient) => {
      const inventoryItem = inventory.find(
        (inv) => inv.id === ingredient.inventoryId
      );
      return (
        inventoryItem &&
        inventoryItem.availableQuantity < ingredient.quantityUsed
      );
    });

    const validReviews = item.reviews.filter((review) => review.rating > 0);
    const averageRating =
      validReviews.reduce((sum, review) => sum + review.rating, 0) /
      (validReviews.length || 1);

    return {
      id: item.id,
      name: item.name,
      rating: averageRating ? averageRating.toString() : "N/A",
      price: item.price,
      createdAt: format(getISTTime(item.createdAt), "MMMM do, yyyy"),
      status: outOfStock ? "Out of Stock" : "In Stock",
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6 max-[425px]:px-3">
        <MenuClient data={formattedMenu} />
      </div>
    </div>
  );
};

export default MenusPage;
