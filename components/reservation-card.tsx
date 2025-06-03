import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Timer, Users, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Table } from "@prisma/client";
import { format } from "date-fns";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator"; // Import Separator component
import { getISTTime } from "@/lib/getISTTime";

interface ReservationCardProps {
  data: {
    id: string;
    date: Date;
    name: string;
    table: Table;
    visitors: number;
    status: string;
    resId: string | string[];
  }[];
}

export function ReservationCard({ data }: ReservationCardProps) {
  const [searchTerm, setSearchTerm] = useState(""); // State to track search input
  const [statusFilter, setStatusFilter] = useState("all"); // State to track status filter

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return <Clock className="h-4 w-4 mr-2" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 mr-2" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 mr-2" />;
      default:
        return <Timer className="h-4 w-4 mr-2" />;
    }
  };

  // Filter reservations based on search term and selected status
  const filteredData = data
    .filter((reservation) =>
      reservation.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((reservation) => {
      if (statusFilter === "all") return true;
      return reservation.status.toLowerCase() === statusFilter.toLowerCase();
    });

  // Group reservations by status
  const upcomingReservations = filteredData.filter(
    (reservation) => reservation.status.toLowerCase() === "upcoming"
  );
  const completedReservations = filteredData.filter(
    (reservation) => reservation.status.toLowerCase() === "completed"
  );
  const cancelledReservations = filteredData.filter(
    (reservation) => reservation.status.toLowerCase() === "cancelled"
  );

  const renderReservationCards = (reservations: typeof data) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reservations.map((reservation) => (
        <Card
          key={reservation.id}
          className="hover:shadow-lg transition-shadow"
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xl font-bold text-primary">
                  {format(getISTTime(reservation.date), "MMMM do, yyyy 'at' h:mm a")}
                </p>
                <p className="text-muted-foreground">{reservation.name}</p>
              </div>
              <div className="bg-primary text-primary-foreground px-2 py-1 rounded-md text-sm font-semibold">
                {reservation.table.name}
              </div>
            </div>
            <div className="flex justify-center flex-col">
              <div className="flex items-center text-muted-foreground">
                <Users className="h-4 w-4 mr-2" />
                <span>Party of {reservation.visitors}</span>
              </div>
              <div
                className={`w-max flex items-center mt-2 px-2 py-1 rounded-md text-sm font-medium ${getStatusStyle(
                  reservation.status
                )}`}
              >
                {getStatusIcon(reservation.status)}
                <span>{reservation.status}</span>
              </div>
            </div>
            <div className="mt-3 w-max">
              <Link
                href={`/${reservation.resId}/reservation/${reservation.id}`}
              >
                <Button variant="outline" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Update
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <>
      <div className="mb-6 flex items-center gap-4">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name"
          className="max-w-[280px]"
        />

        {/* Status filter using Select */}
        <Select onValueChange={(value) => setStatusFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* If no data or no search result */}
      {filteredData.length === 0 ? (
        <p className="text-center text-muted-foreground mt-8">
          No reservations found.
        </p>
      ) : (
        <>
          {/* Upcoming Reservations Section */}
          {upcomingReservations.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-4 text-blue-800">
                Upcoming Reservations
              </h2>
              {renderReservationCards(upcomingReservations)}
              <Separator className="my-6" />
            </>
          )}

          {/* Completed Reservations Section */}
          {completedReservations.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-4 text-green-800">
                Completed Reservations
              </h2>
              {renderReservationCards(completedReservations)}
              <Separator className="my-6" />
            </>
          )}

          {/* Cancelled Reservations Section */}
          {cancelledReservations.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-4 text-red-800">
                Cancelled Reservations
              </h2>
              {renderReservationCards(cancelledReservations)}
            </>
          )}
        </>
      )}
    </>
  );
}
