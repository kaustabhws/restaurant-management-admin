import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ReviewForm } from "./components/review-form";
import axios from "axios";

const ReviewPage = async ({
  params,
}: {
  params: { resId: string; phoneNo: string; orderSlNo: string };
}) => {
  const { resId, phoneNo, orderSlNo } = params;

  const restaurant = await prismadb.restaurants.findUnique({
    where: {
      id: resId,
    },
  });

  if (!restaurant) {
    redirect("/");
  }

  const customer = await prismadb.customer.findUnique({
    where: {
      phone: phoneNo,
    },
    include: {
      orders: {
        include: {
          orderItems: {
            include: {
              menuItem: true,
            },
          },
        },
      },
    },
  });
  
  if (!customer) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Oops! Customer Not Found
            </CardTitle>
            <CardDescription className="text-center">
              We couldn&apos;t find a customer with the provided phone number. Would
              you like to register?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Enter your name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="Enter your phone number"
                defaultValue={phoneNo}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/">Go Back</Link>
            </Button>
            <Button>Register</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const order = customer.orders.find(order => order.slNo === orderSlNo);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              No Orders Found
            </CardTitle>
            <CardDescription className="text-center">
              We couldn&apos;t find any orders for this customer. Please check back
              later.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const review = await prismadb.review.findFirst({
    where: {
      orderSlNo,
    },
  });

  if (review) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Review Already Submitted
            </CardTitle>
            <CardDescription className="text-center">
              Thank you for your feedback! You have already submitted a review
              for this order.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-background">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Review Your Order
          </CardTitle>
          <CardDescription>
            We&apos;d love to hear your thoughts on the items you ordered!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ReviewForm
            order={order}
            resId={resId}
            phoneNo={phoneNo}
            orderSlNo={orderSlNo}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewPage;
