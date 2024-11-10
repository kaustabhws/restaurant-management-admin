"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { CampaignColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface CampaignClientProps {
  data: CampaignColumn[];
}

export const CampaignClient: React.FC<CampaignClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const filterOptions = {
    key: "status",
    options: [
      { label: "Active", value: "Active" },
      { label: "Expired", value: "Expired" },
      { label: "Starts Soon", value: "Starts Soon" },
    ],
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Campaigns (${data.length})`}
          description="Manage campaigns for your restaurant"
        />
        <Button
          onClick={() => router.push(`/${params.restaurantId}/campaigns/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" filterOptions={filterOptions} />
    </>
  );
};
