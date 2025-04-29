import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "./components/sidebar-nav";
import { Heading } from "@/components/ui/heading";
import { auth } from "@clerk/nextjs";
import { hasPermission } from "@/utils/has-permissions";
import AccessDenied from "@/components/access-denied";

interface SettingsLayoutProps {
  children: React.ReactNode;
  params: {
    restaurantId: string;
  }
}

const SettingsLayout = async ({ children, params }: SettingsLayoutProps) => {

  const { userId } = auth();

  const hasAccess = await hasPermission(userId!, "FullAccess")

  if(!hasAccess) {
    return (
      <AccessDenied url={params.restaurantId} />
    )
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 max-[425px]:px-3">
      <Heading title="Settings" description="Manage your account settings" />
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <SidebarNav />
        </aside>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

export default SettingsLayout;