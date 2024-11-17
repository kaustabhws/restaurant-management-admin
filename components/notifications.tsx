import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import prismadb from "@/lib/prismadb";
import NotificationContent from "./notification-content";

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
        <Button variant="ghost" size="icon" className="relative !ml-0">
          <Bell className="h-[1.2rem] w-[1.2rem]" />
          {unreadNotifications > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs min-w-[1.2rem] h-[1.2rem] flex items-center justify-center"
            >
              {unreadNotifications > 99 ? "99+" : unreadNotifications}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <NotificationContent
          notifications={notifications}
          markAsRead={markAsRead}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Notification;
