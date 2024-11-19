import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Star,
  Search,
  ChevronRight,
  IndianRupee,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Currency, Customer, Prisma } from "@prisma/client";
import { format } from "date-fns";
import Link from "next/link";
import { getCurrencyIcon } from "@/lib/getCurrenctIcon";

type MenuWithIngredients = Prisma.MenuGetPayload<{
  include: { reviews: true };
}>;

export default function ReviewCard({
  data,
  customer,
  currency,
}: {
  data: MenuWithIngredients[];
  customer: Customer[];
  currency: { currency: Currency };
}) {
  const [searchQuery, setSearchQuery] = useState("");

  // Separate items with reviews and items without reviews
  const reviewedItems = data.filter((item) => item.reviews.length > 0);
  const notReviewedItems = data.filter((item) => item.reviews.length === 0);

  // Filter both lists by search query
  const filteredReviewedItems = reviewedItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredNotReviewedItems = notReviewedItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto">
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      <div className="space-y-6">
        {/* Display items with reviews in full width */}
        {filteredReviewedItems.length > 0 ? (
          filteredReviewedItems.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              customer={customer}
              currency={currency}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">
            No menu items found matching your search.
          </p>
        )}

        {/* Display items without reviews in a responsive grid */}
        {filteredNotReviewedItems.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredNotReviewedItems.map((item) => (
              <Card key={item.id} className="text-center">
                <CardHeader>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">Not yet reviewed</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MenuItem({
  item,
  customer,
  currency,
}: {
  item: MenuWithIngredients;
  customer: Customer[];
  currency: { currency: Currency };
}) {
  const [expanded, setExpanded] = useState(false);
  const validReviews = item.reviews.filter((review) => review.rating > 0);
  const averageRating =
    validReviews.reduce((sum, review) => sum + review.rating, 0) /
    (validReviews.length || 1);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">{item.name}</CardTitle>
            <div className="flex items-center mt-1 space-x-2">
              <span className="text-sm text-muted-foreground flex items-center">
                {getCurrencyIcon({
                  currency: currency.currency,
                  size: 14,
                })}
                {item.price.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(averageRating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">
              {averageRating.toFixed(1)} ({item.reviews.length} reviews)
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
            {item.reviews.slice(0, 3).map((review) => {
              const matchingCustomer = customer.find(
                (customer) => customer.id === review.customerId
              );
              return (
                <TableRow key={review.id}>
                  <TableCell>
                    {format(review.createdAt, "dd MMMM, yyyy")}
                  </TableCell>
                  <TableCell>
                    {matchingCustomer ? matchingCustomer.phone : "N/A"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                      <span>{review.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>{review.review ? review.review : "N/A"}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {item.reviews.length > 3 && (
          <Link href={`/${item.resId}/reviews/${item.id}`}>
            <Button variant="ghost" className="text-sm ml-auto">
              View All Reviews
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
