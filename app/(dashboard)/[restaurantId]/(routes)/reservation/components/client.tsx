"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { ReservationCard } from "@/components/reservation-card";
import { Reservation, Table } from "@prisma/client";

interface ReservationClientProps {
  data: (Reservation & { table: Table })[];
}

export const ReservationClient: React.FC<ReservationClientProps> = ({
  data,
}) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Reservations (${data.filter(item => item.status === "Upcoming").length})`}
          description="Manage reservations"
        />
        <Button
          onClick={() => router.push(`/${params.restaurantId}/reservation/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New
        </Button>
      </div>
      <Separator />
      <ReservationCard data={data} />
    </>
  );
};
