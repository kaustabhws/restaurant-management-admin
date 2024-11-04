import prismadb from "@/lib/prismadb";
import { MenuForm } from "./components/menu-form";

const MenuPage = async ({ params }: { params: { menuId: string, restaurantId: string } }) => {
  const menu = await prismadb.menu.findUnique({
    where: {
      id: params.menuId,
    },
    include: {
      ingredients: true,
    },
  });

  const inventory = await prismadb.inventory.findMany({
    where: {
      resId: params.restaurantId,
    }
  })

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-4 max-[425px]:px-3">
        <MenuForm initialData={menu} inventory={inventory} />
      </div>
    </div>
  );
};

export default MenuPage;
