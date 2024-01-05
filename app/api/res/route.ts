import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(
    req: Request
) {
    try {
        const { userId } = auth();
        const body = await req.json()

        const { name } = body;

        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        if(!name) {
            return new NextResponse("Name is required", { status: 400 })
        }

        const restaurant = await prismadb.restaurants.create({
            data: {
                name,
                userId
            }
        })
        return NextResponse.json(restaurant)

    } catch (error) {
        console.log('[RESTAURANTS_POST]', error)
        return new NextResponse("Internal error", { status: 500 })
    }
}
