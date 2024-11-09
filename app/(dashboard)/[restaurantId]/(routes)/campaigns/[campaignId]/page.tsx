import prismadb from "@/lib/prismadb";
import { CampaignForm } from "./components/campaign-form";

const MenuPage = async ({
  params,
}: {
  params: { campaignId: string; restaurantId: string };
}) => {
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
