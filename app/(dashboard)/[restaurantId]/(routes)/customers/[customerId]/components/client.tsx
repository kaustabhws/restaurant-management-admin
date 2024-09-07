"use client";

import { Separator } from "@/components/ui/separator";
import { TransactionColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StarIcon, UserIcon } from "lucide-react";

interface TransactionClientProps {
  data: TransactionColumn[];
  contact: string;
  loyaltyPoints: number;
}

export const TransactionClient: React.FC<TransactionClientProps> = ({
  data,
  contact,
  loyaltyPoints,
}) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Card className="shadow-lg max-[650px]:flex-1">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <UserIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Contact
                  </p>
                  <p className="text-lg font-semibold">{contact}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <StarIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Loyalty Points
                  </p>
                  <p className="text-lg font-semibold">{loyaltyPoints}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="description" />
    </>
  );
};
