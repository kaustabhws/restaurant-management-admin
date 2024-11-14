"use client";

import { DataTable } from "@/components/ui/data-table";
import { OrderHistoryColumn, columns } from "./order-history-column";

interface OrderClientProps {
  data: OrderHistoryColumn[];
}

export const OrderClient: React.FC<OrderClientProps> = ({
  data,
}) => {
  return (
    <>
      <DataTable columns={columns} data={data} searchKey="orderSlNo" />
    </>
  );
};
