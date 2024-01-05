"use client"

import { useRestaurantModal } from "@/hooks/use-restautant-modal";
import { useEffect } from "react";

const Page = () => {

    const onOpen = useRestaurantModal((state) => state.onOpen)
    const isOpen = useRestaurantModal((state) => state.isOpen)

    useEffect(() => {
      if(!isOpen) {
        onOpen();
      }
    }, [isOpen, onOpen])
    

    return null;
}
 
export default Page;