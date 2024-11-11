import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { resId, phoneNo, orderSlNo, reviews } = body;

    if (!resId || !phoneNo || !orderSlNo || !reviews) {
      return new Response("Invalid request", { status: 400 });
    }

    const customer = await prismadb.customer.findUnique({
      where: { phone: phoneNo },
    });

    if (!customer) {
      return new Response("Customer not found", { status: 404 });
    }

    const reviewPromises = Object.entries(reviews)
      .filter(([, reviewData]) => (reviewData as { rating: number }).rating > 0)
      .map(async ([itemId, reviewData]) => {
        const { rating, comment } = reviewData as {
          rating: number;
          comment: string;
        };

        // Create a review for each itemId where rating > 0
        return await prismadb.review.create({
          data: {
            resId,
            customerId: customer.id,
            itemId,
            orderSlNo,
            rating,
            review: comment,
          },
        });
      });

    const createdReviews = await Promise.all(reviewPromises);

    return NextResponse.json(createdReviews);
  } catch (error) {
    console.log("REVIEW_POST_ERROR", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
