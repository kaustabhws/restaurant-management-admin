import prismadb from "@/lib/prismadb";
import { CampaignColumn } from "./components/columns";
import { format } from "date-fns";
import { getISTTime } from "@/lib/getISTTime";
import { CampaignClient } from "./components/client";

const CampaignPage = async ({
  params,
}: {
  params: { restaurantId: string };
}) => {
  const campaigns = await prismadb.campaign.findMany({
    where: {
      resId: params.restaurantId,
    },
  });

  const formattedMenu: CampaignColumn[] = campaigns.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    code: item.code,
    status: new Date() > item.endDate ? "Expired" : "Active",
    startDate: format(getISTTime(item.startDate), "MMMM do, yyyy"),
    endDate: format(getISTTime(item.endDate), "MMMM do, yyyy"),
    createdAt: format(getISTTime(item.createdAt), "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6 max-[425px]:px-3">
        <CampaignClient data={formattedMenu} />
      </div>
    </div>
  );
};

export default CampaignPage;
