"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { InventoryColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface InventoryClientProps {
  data: InventoryColumn[];
}

export const InventoryClient: React.FC<InventoryClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const lowStockItems = data.filter((item) => item.status === "Low Stock");

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
      {lowStockItems.length > 0 && (
        <div>
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-5 w-5" color="red" />
            <AlertTitle className="ml-2 font-semibold text-red-600">
              Low Stock Warning
            </AlertTitle>
            <AlertDescription className="mt-2 text-red-700">
              <div className="space-y-2">
                <p>The following items require immediate attention:</p>
                <ul className="list-disc pl-4 space-y-1">
                  {lowStockItems.map((item) => (
                    <li key={item.name}>
                      {item.name} - Current: {item.availableQuantity}{" | "}
                      Threshold: {item.minStockThreshold}
                    </li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}

      <DataTable columns={columns} data={data} searchKey="name" />
    </>
  );
};
