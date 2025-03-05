"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

interface TablePopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  tables: any[];
  onSelectTable: (tableId: string) => void;
  currentTableId?: string;
  resId: string;
}

export default function TablePopupModal({
  isOpen,
  onClose,
  tables,
  onSelectTable,
  currentTableId,
  resId,
}: TablePopupModalProps) {
  const [selectedTableId, setSelectedTableId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSelectTable = (value: string) => {
    setSelectedTableId(value);
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const res = await axios.patch(`/api/${resId}/tableoverview/transfer`, {
        oldTableId: currentTableId,
        newTableId: selectedTableId,
      });

      if (res.status === 200) {
        toast.success("Table transfer successful");
        onClose();
        router.refresh();
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getSelectedTable = () => {
    return tables.find((table) => table.id === selectedTableId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select a Table</DialogTitle>
          <DialogDescription>
            Choose a table from the available options below.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <Select onValueChange={handleSelectTable} value={selectedTableId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a table" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Available Tables</SelectLabel>
                {tables.map((table) => (
                  <SelectItem key={table.id} value={table.id}>
                    {table.name} ({table.seats} seats)
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {selectedTableId && (
            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-2">Table Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Name:</span>
                <span>{getSelectedTable()?.name}</span>

                <span className="text-muted-foreground">Seats:</span>
                <span>{getSelectedTable()?.seats}</span>

                <span className="text-muted-foreground">Status:</span>
                <Badge
                  className="w-max"
                  variant={
                    getSelectedTable()?.status === "Available"
                      ? "success"
                      : "destructive"
                  }
                >
                  {getSelectedTable()?.status}
                </Badge>
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={
              loading ||
              !selectedTableId ||
              currentTableId === selectedTableId ||
              ["Occupied", "Reserved"].includes(getSelectedTable()?.status)
            }
          >
            <Check className="mr-2 h-4 w-4" />
            Confirm Selection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
