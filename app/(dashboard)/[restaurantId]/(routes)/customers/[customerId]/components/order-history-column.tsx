import { ColumnDef } from "@tanstack/react-table";

export type OrderHistoryColumn = {
  id: string;
  orderSlNo: string;
  isPaid: string;
  orderValue: number;
  createdAt: string;
};

export const columns: ColumnDef<OrderHistoryColumn>[] = [
  {
    accessorKey: "orderSlNo",
    header: "Order No.",
  },
  {
    accessorKey: "isPaid",
    header: "Payment Status",
    cell: ({ row }) => {
        return (
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 whitespace-nowrap text-xs font-semibold ${
              row.original.isPaid === "Paid" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {row.original.isPaid}
          </span>
        );
      },
  },
  {
    accessorKey: "orderValue",
    header: "Amount",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
];
