import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bell,
  Calendar,
  MessageSquareWarning,
  ShoppingCart,
} from "lucide-react";
import { Button } from "./ui/button";
import prismadb from "@/lib/prismadb";
import Link from "next/link";
import NotificationContent from "./notification-content";
import axios from "axios";
import toast from "react-hot-toast";

interface NotificationProps {
  resId: string;
}

const Notification: React.FC<NotificationProps> = async ({ resId }) => {
  const notifications = await prismadb.notification.findMany({
    where: {
      resId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Calculate unread notifications
  const unreadNotifications = notifications.filter(
    (notification) => notification.status === "Unread"
  ).length;

  const markAsRead = async (notificationId: string) => {
    "use server";
    await prismadb.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        status: "Read",
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-[1.2rem]" />
          <p className="absolute text-red-500 font-bold -top-1 right-1 text-base">
            {unreadNotifications > 0 ? unreadNotifications : ""}
          </p>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <NotificationContent
          notifications={notifications}
          markAsRead={markAsRead}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notification;
