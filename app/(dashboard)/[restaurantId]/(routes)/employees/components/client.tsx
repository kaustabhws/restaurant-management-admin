"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { EmployeeColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmployeeClientProps {
  data: EmployeeColumn[];
}

export const EmployeeClient: React.FC<EmployeeClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Employees (${data.length})`}
          description="Manage employees for your restaurant"
        />
        <Button onClick={() => router.push(`/${params.restaurantId}/employees/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="contact" />
    </>
  );
};
