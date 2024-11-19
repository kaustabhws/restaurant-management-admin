"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Currency, Customer, Prisma } from "@prisma/client";
import ReviewCard from "./review-card";

type MenuWithReviews = Prisma.MenuGetPayload<{
  include: { reviews: true };
}>;

interface ReviewClientProps {
  data: MenuWithReviews[];
  customer: Customer[];
  currency: { currency: Currency }
}

export const ReviewClient: React.FC<ReviewClientProps> = ({ data, customer, currency }) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Reviews by Customers" description="" />
      </div>
      <Separator />
      <ReviewCard data={data} customer={customer} currency={currency} />
    </>
  );
};
