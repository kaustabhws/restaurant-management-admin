"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { InventoryColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface InventoryClientProps {
  data: InventoryColumn[];
}

export const InventoryClient: React.FC<InventoryClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Inventory items (${data.length})`}
          description="Manage inventory items for your restaurant"
        />
        <Button
          onClick={() => router.push(`/${params.restaurantId}/inventory/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
    </>
  );
};
