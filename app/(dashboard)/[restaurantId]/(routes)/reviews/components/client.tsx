"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Customer, Prisma } from "@prisma/client";
import ReviewCard from "./review-card";

type MenuWithReviews = Prisma.MenuGetPayload<{
  include: { reviews: true };
}>;

interface ReviewClientProps {
  data: MenuWithReviews[];
  customer: Customer[];
}

export const ReviewClient: React.FC<ReviewClientProps> = ({ data, customer }) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Reviews by Customers" description="" />
      </div>
      <Separator />
      <ReviewCard data={data} customer={customer} />
    </>
  );
};
