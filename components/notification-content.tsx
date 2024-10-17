"use client";

import { useState } from "react";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Notification } from "@prisma/client";
import {
  Bell,
  Calendar,
  MessageSquareWarning,
  ShoppingCart,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import axios from "axios";

interface NotificationContentProps {
  notifications: Notification[];
  markAsRead: (notificationId: string) => void;
}

export default function NotificationContent({
  notifications,
  markAsRead,
}: NotificationContentProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  if (notifications.length === 0) {
    return <DropdownMenuItem>No notifications</DropdownMenuItem>;
  }

  const formatTimeAgo = (createdAt: Date) => {
    const currentTime = new Date(); // local time
    const notificationTime = new Date(createdAt); // UTC time from DB

    // Convert notification time to local time
    const localNotificationTime = new Date(
      notificationTime.getTime() + currentTime.getTimezoneOffset() * 60000
    );

    const diffInMs = currentTime.getTime() - localNotificationTime.getTime();

    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else if (diffInWeeks < 4) {
      return `${diffInWeeks}w ago`;
    } else {
      const diffInMonths = Math.floor(diffInDays / 30);
      return `${diffInMonths}mo ago`;
    }
  };

  const markAllRead = async () => {
    setIsLoading(true);
    try {
      const resp = await axios.patch(
        `/api/${notifications[0].resId}/notification`,
        {
          type: "read",
        }
      );
      if (resp.status === 200) {
        toast.success("Marked all as read");
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to mark as read");
    } finally {
      setIsLoading(false);
    }
  };

  const removeNotification = async () => {
    setIsLoading(true);
    try {
      const resp = await axios.patch(
        `/api/${notifications[0].resId}/notification`,
        {
          type: "remove",
        }
      );
      if (resp.status === 200) {
        toast.success("Removed all notifications");
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to remove notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "Reservation":
        return <Calendar className="h-4 w-4 flex-shrink-0" />;
      case "Order":
        return <ShoppingCart className="h-4 w-4 flex-shrink-0" />;
      case "General":
        return <MessageSquareWarning className="h-4 w-4 flex-shrink-0" />;
      default:
        return <Bell className="h-4 w-4 flex-shrink-0" />;
    }
  };

  const unreadNotifications = notifications.filter(
    (notification) => notification.status === "Unread"
  ).length;

  return (
    <div className="w-full max-w-sm sm:max-w-md">
      <DropdownMenuLabel className="font-normal p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span className="text-sm">
            Notifications: {unreadNotifications} unread
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs px-2 py-1"
              onClick={markAllRead}
              disabled={isLoading}
            >
              Mark all read
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs px-2 py-1"
              onClick={removeNotification}
              disabled={isLoading}
            >
              Remove all
            </Button>
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <div className="max-h-[60vh] overflow-y-auto">
        {notifications.slice(0, 8).map((notification) => (
          <DropdownMenuItem
            key={notification.id}
            onClick={() => {
              markAsRead(notification.id);
              router.refresh();
            }}
            className={`flex items-start justify-between p-4 ${
              notification.status === "Read" ? "text-muted-foreground" : ""
            }`}
          >
            <div className="flex items-start space-x-2">
              {getIcon(notification.type)}
              <div className="flex flex-col">
                <p className="text-sm break-words">{notification.message}</p>
                <span className="text-xs text-muted-foreground mt-1">
                  {formatTimeAgo(notification.createdAt)}
                </span>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </div>
    </div>
  );
}
