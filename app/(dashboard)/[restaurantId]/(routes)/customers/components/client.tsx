"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { CustomerColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";

interface CustiomerClientProps {
  data: CustomerColumn[];
}

export const CustiomerClient: React.FC<CustiomerClientProps> = ({ data }) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Customers (${data.length})`}
          description="Manage customer for your restaurant"
        />
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="contact" />
    </>
  );
};
