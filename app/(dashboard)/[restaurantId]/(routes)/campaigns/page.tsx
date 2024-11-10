import prismadb from "@/lib/prismadb";
import { CampaignColumn } from "./components/columns";
import { format, startOfDay } from "date-fns";
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

  const formattedMenu: CampaignColumn[] = campaigns.map((item) => {
    const currentDate = startOfDay(new Date());
    const startDate = startOfDay(item.startDate);
    const endDate = startOfDay(item.endDate);

    const status =
      currentDate < startDate
        ? "Not Active"
        : currentDate > endDate
        ? "Expired"
        : "Active";

    return {
      id: item.id,
      name: item.name,
      description: item.description,
      code: item.code,
      status,
      startDate: format(startDate, "MMMM do, yyyy"),
      endDate: format(endDate, "MMMM do, yyyy"),
      createdAt: format(
        startOfDay(getISTTime(item.createdAt)),
        "MMMM do, yyyy"
      ),
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6 max-[425px]:px-3">
        <CampaignClient data={formattedMenu} />
      </div>
    </div>
  );
};

export default CampaignPage;
