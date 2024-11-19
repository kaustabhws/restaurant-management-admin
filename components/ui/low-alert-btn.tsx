"use client";

import { Currency, Inventory } from "@prisma/client";
import { TriangleAlert } from "lucide-react";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { LowStockModal } from "../modals/low-stock-alert";
import { Button } from "./button";

const LowStockAlertButton = ({
  lowStockItems,
  currency,
}: {
  lowStockItems: Inventory[];
  currency: Currency;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <Button size="icon" variant="ghost" onClick={() => setIsModalOpen(true)}>
        <TriangleAlert color="red" className="h-[1.4rem] w-[1.4rem]" />
      </Button>
      <LowStockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        items={lowStockItems}
        currency={currency}
      />
    </div>
  );
};

export default LowStockAlertButton;
