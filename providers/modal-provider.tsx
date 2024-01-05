"use client"

import { RestaurantModal } from "@/components/modals/restaurant-modal"
import { useEffect, useState } from "react"

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
      setIsMounted(true)
    }, [])
    
    if(!isMounted) {
        return null;
    }

    return (
        <>
            <RestaurantModal />
        </>
    )

}