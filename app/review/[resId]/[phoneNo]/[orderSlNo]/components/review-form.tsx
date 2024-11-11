"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type MenuItem = {
  id: string;
  name: string;
  price: number;
};

type OrderItem = {
  id: string;
  itemId: string;
  quantity: number;
  menuItem: MenuItem;
};

type Order = {
  id: string;
  orderItems: OrderItem[];
};

type ReviewFormProps = {
  order: Order;
  resId: string;
  phoneNo: string;
  orderSlNo: string;
};

const StarRating = ({
  rating,
  onRatingChange,
}: {
  rating: number;
  onRatingChange: (rating: number) => void;
}) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-6 h-6 cursor-pointer ${
            star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
          }`}
          onClick={() => onRatingChange(star)}
        />
      ))}
    </div>
  );
};

export function ReviewForm({
  order,
  resId,
  orderSlNo,
  phoneNo,
}: ReviewFormProps) {
  const router = useRouter();

  const [reviews, setReviews] = useState<
    Record<string, { rating: number; comment: string }>
  >(
    Object.fromEntries(
      order.orderItems.map((item) => [item.itemId, { rating: 0, comment: "" }])
    )
  );

  const handleRatingChange = (itemId: string, rating: number) => {
    setReviews((prev) => ({ ...prev, [itemId]: { ...prev[itemId], rating } }));
  };

  const handleCommentChange = (itemId: string, comment: string) => {
    setReviews((prev) => ({ ...prev, [itemId]: { ...prev[itemId], comment } }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validReviews = Object.entries(reviews)
      .filter(([_, review]) => review.rating > 0)
      .map(([itemId, review]) => ({ itemId, ...review }));

    try {
      const review = await axios.post("/api/review", {
        resId: resId,
        phoneNo: phoneNo,
        orderSlNo: orderSlNo,
        reviews: reviews,
      });

      toast.success("Review Submitted");
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {order.orderItems.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle>{item.menuItem.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <StarRating
              rating={reviews[item.itemId].rating}
              onRatingChange={(rating) =>
                handleRatingChange(item.itemId, rating)
              }
            />
            <Textarea
              placeholder="Your review (optional)"
              value={reviews[item.itemId].comment}
              onChange={(e) => handleCommentChange(item.itemId, e.target.value)}
            />
          </CardContent>
        </Card>
      ))}
      <Button type="submit" className="w-full">
        Submit Reviews
      </Button>
    </form>
  );
}
