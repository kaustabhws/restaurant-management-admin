import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from 'next/navigation'

export default async function SetupLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const { userId } = auth();

    if(!userId) {
        redirect('/sign-in')
    }

    const restaurant = await prismadb.restaurants.findFirst({
        where: {
            userId
        }
    });

    if(restaurant) {
        redirect(`/${restaurant.id}`)
    }

    return (
        <>
            {children}
        </>
    )
}