"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Share, QrCode, Clipboard } from "lucide-react";
import QRCode from "qrcode";
import { useOrigin } from "@/hooks/use-origin";
import { Input } from "./ui/input";
import toast from "react-hot-toast";
import Image from "next/image";

interface Restaurant {
  id: string;
  name: string;
}

type Customer = {
  id: string;
  email: string | null;
  phone: string | null;
  loyaltyPoints: number;
  totalSpent: number;
};

type Order = {
  id: string;
  slNo: string;
  resId: string;
  tableNo: string | null;
  payMode: string;
  orderType: string;
  amount: number;
  isPaid: boolean;
};

interface ReviewShareProps {
  customer: Customer;
  restaurant: Restaurant;
  order: Order;
}

type ShareProvider = {
  name: string;
  url: string;
};

const ReviewShare: React.FC<ReviewShareProps> = ({
  customer,
  restaurant,
  order,
}) => {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [qrCodeDataURL, setQRCodeDataURL] = useState<string | null>(null);
  const [inputUrl, setInputUrl] = useState<string>("");
  const [shareProvider, setShareProvider] = useState<ShareProvider[]>([]);
  const origin = useOrigin();

  const reviewUrl = `${origin}/review/${restaurant.id}/${customer.phone}/${order.slNo}`;

  const handleShare = async () => {
    setIsShareModalOpen(true);
  };

  const generateQRCode = useCallback(async () => {
    try {
      const dataURL = await QRCode.toDataURL(reviewUrl, {
        width: 200,
        margin: 2,
      });
      setQRCodeDataURL(dataURL);
      setInputUrl(reviewUrl);
      setIsQRModalOpen(true);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  }, [reviewUrl]);

  useEffect(() => {
    const baseProviders = [
      {
        name: "WhatsApp",
        url: `https://wa.me/${customer.phone}?text=${encodeURIComponent(
          `Please share your experience with us! ${reviewUrl}`
        )}`,
      },
    ];

    const isMobile = /Android|iPhone/i.test(navigator.userAgent);

    if (isMobile) {
      baseProviders.push({
        name: "SMS",
        url: `sms:+91${customer.phone}/?body=${encodeURIComponent(
          `Please share your experience with us! ${reviewUrl}`
        )}`,
      });
    }

    setShareProvider(baseProviders);
  }, [customer.phone, reviewUrl]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(inputUrl);
      toast.success("Copied to Clipboard");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <h2 className="text-2xl font-bold mb-2">Share Your Review</h2>
      <div className="flex space-x-4">
        <Button onClick={handleShare} className="flex items-center space-x-2">
          <Share className="w-4 h-4" />
          <span>Share Link</span>
        </Button>
        <Button
          onClick={generateQRCode}
          className="flex items-center space-x-2"
        >
          <QrCode className="w-4 h-4" />
          <span>Generate QR</span>
        </Button>
      </div>

      <Dialog open={isQRModalOpen} onOpenChange={setIsQRModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan QR Code to Review</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center p-6">
            {qrCodeDataURL && (
              <Image
                height={100}
                width={100}
                src={qrCodeDataURL}
                alt="QR Code for review"
                className="w-48 h-48"
              />
            )}
          </div>
          <DialogFooter className="!flex !items-center !gap-1 !flex-row">
            <Input value={inputUrl} contentEditable={false} autoFocus={false} />
            <Button size="icon" variant="ghost" onClick={copyLink}>
              <Clipboard className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Review Link</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-4 p-4">
            {shareProvider.map((provider) => (
              <a
                key={provider?.name}
                href={provider?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-center hover:bg-primary/90 transition-colors"
              >
                Share on {provider?.name}
              </a>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewShare;
