import { AccessControl } from "@/components/access-control";
import prismadb from "@/lib/prismadb";
import { PermissionName, Role } from "@/types/permissions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const AccessControlPage = async ({
  params,
}: {
  params: { restaurantId: string };
}) => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const restaurant = await prismadb.restaurants.findFirst({
    where: {
      id: params.restaurantId,
    },
    include: {
      users: {
        include: {
          role: {
            include: {
              permissions: true,
            },
          },
        },
      },
    },
  });

  const admin = {
    id: user.id,
    name: user.firstName + " " + user.lastName,
    email: user.emailAddresses[0]?.emailAddress || "",
    phone: restaurant?.phone || "",
    role: "Admin" as Role,
    permissions: [PermissionName.FullAccess],
  };

  const members =
    restaurant?.users?.map((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role.name as Role,
        permissions: user.role.permissions.map((permission) => {
          return permission.name as PermissionName;
        }),
      };
    }) || [];

  return (
    <div>
      <AccessControl admin={admin} members={members} resId={restaurant?.id!} />
    </div>
  );
};

export default AccessControlPage;
