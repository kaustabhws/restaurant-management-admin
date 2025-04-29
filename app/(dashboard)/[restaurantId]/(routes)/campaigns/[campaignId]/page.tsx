import prismadb from "@/lib/prismadb";
import { CampaignForm } from "./components/campaign-form";
import { auth } from "@clerk/nextjs";
import { hasPermission } from "@/utils/has-permissions";
import AccessDenied from "@/components/access-denied";

const MenuPage = async ({
  params,
}: {
  params: { campaignId: string; restaurantId: string };
}) => {
  const { userId } = auth();

  const hasAccess =
    (await hasPermission(userId!, "UpdateCampaigns")) ||
    (await hasPermission(userId!, "CreateCampaigns"));

  if (!hasAccess) {
    return <AccessDenied url={`/${params.restaurantId}`} />;
  }

  const campaign = await prismadb.campaign.findUnique({
    where: {
      id: params.campaignId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-4 max-[425px]:px-3">
        <CampaignForm initialData={campaign} />
      </div>
    </div>
  );
};

export default MenuPage;
