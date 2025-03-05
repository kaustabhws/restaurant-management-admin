"use client";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, SendHorizonal } from "lucide-react";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import TablePopupModal from "./table-popup";
import { useState } from "react";

interface CellActionProps {
  data: any;
  tables: any;
  resId: string;
}

export const CellAction: React.FC<CellActionProps> = ({ data, tables, resId }) => {
  const router = useRouter();
  const params = useParams();

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Table ID copied to the clipboard");
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectTable = (tableId: string) => {
    setSelectedTableId(tableId);
    console.log("Selected table ID:", tableId);
    // You can perform additional actions with the selected table ID here
  };

  return (
    <>
      <TablePopupModal
        tables={tables}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSelectTable={handleSelectTable}
        currentTableId={data.id}
        resId={resId}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/${params.restaurantId}/tables-overview/${data.id}`)
            }
          >
            <Edit className="mr-2 h-4 w-4" />
            Manage
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleOpenModal}>
            <SendHorizonal className="mr-2 h-4 w-4" />
            Transfer to another table
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
