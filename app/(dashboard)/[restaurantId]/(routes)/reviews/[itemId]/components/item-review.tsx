"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

type Customer = {
  id: string;
  resId: string;
  createdAt: Date;
  updatedAt: Date;
  email: string | null;
  phone: string | null;
  loyaltyPoints: number;
  totalSpent: number;
};

type Review = {
  id: string;
  resId: string;
  createdAt: Date;
  updatedAt: Date;
  review: string;
  customerId: string;
  itemId: string;
  orderSlNo: string;
  rating: number;
  customer: Customer;
};

type MenuWithReviews = {
  name: string;
  id: string;
  price: number;
  resId: string;
  createdAt: Date;
  updatedAt: Date;
  reviews: Review[];
};

export default function ItemReviewCard({
  itemReviews,
}: {
  itemReviews: MenuWithReviews;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 8;
  const totalPages = Math.ceil(itemReviews.reviews.length / reviewsPerPage);

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = itemReviews.reviews.slice(
    indexOfFirstReview,
    indexOfLastReview
  );

  const validReviews = itemReviews.reviews.filter(
    (review) => review.rating > 0
  );
  const averageRating =
    validReviews.reduce((sum, review) => sum + review.rating, 0) /
    (validReviews.length || 1);

  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">{itemReviews.name}</CardTitle>
              <div className="flex items-center mt-2 space-x-2">
                <span className="text-sm text-muted-foreground">
                  ₹{itemReviews.price.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(averageRating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">
                {averageRating.toFixed(1)} ({itemReviews.reviews.length}{" "}
                reviews)
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    {format(review.createdAt, "dd MMMM, yyyy")}
                  </TableCell>
                  <TableCell>{review.customer.phone}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                      <span>{review.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>{review.review ? review.review : "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="flex items-center"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
