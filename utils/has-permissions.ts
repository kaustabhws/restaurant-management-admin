import prismadb from "@/lib/prismadb";

/**
 * Checks if a user has a specific permission.
 * @param userId - The ID of the user (Clerk ID).
 * @param requiredPermission - The permission to check for.
 * @returns A boolean indicating if the user has the required permission.
 */
export async function hasPermission(
  userId: string,
  requiredPermission: string
): Promise<boolean> {
  if (!userId) {
    return false;
  }

  // Check if the userId matches the restaurant's userId
  const restaurant = await prismadb.restaurants.findFirst({
    where: { userId },
  });

  if (restaurant) {
    // If the userId matches the restaurant's userId, grant full access
    return true;
  }

  // Fetch the user's role and permissions
  const user = await prismadb.user.findUnique({
    where: { clerkId: userId },
    include: {
      role: {
        include: {
          permissions: true,
        },
      },
    },
  });

  if (!user || !user.role || !user.role.permissions) {
    return false;
  }

  // Check if the required permission exists in the user's permissions
  return user.role.permissions.some(
    (permission) => permission.name === requiredPermission
  );
}
