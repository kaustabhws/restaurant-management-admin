"use client";

import { Currency, Inventory } from "@prisma/client";
import { useState } from "react";
import { LowStockModal } from "../modals/low-stock-alert";

const LowStockAlertButton = ({
  lowStockItems,
  currency,
  children,
}: {
  lowStockItems: Inventory[];
  currency: Currency;
  children: React.ReactNode;
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div onClick={() => setIsModalOpen(true)} style={{ display: "inline-block" }}>
        {children}
      </div>
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
