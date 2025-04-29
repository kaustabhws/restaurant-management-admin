"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Heading } from "@/components/ui/heading"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Inventory, Prisma, Table } from "@prisma/client"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { OrderClient } from "./client"
import type { OrderColumn } from "./order-status"
import { format } from "date-fns"
import toast from "react-hot-toast"
import { MenuItemGrid } from "@/components/menu-item-grid"

const formSchema = z.object({
  menuItem: z.union([z.string(), z.array(z.string())]),
  quantity: z.coerce.number().min(1),
  tableId: z.string().min(1),
})

type MenuWithIngredients = Prisma.MenuGetPayload<{
  include: { ingredients: true; images: true }
}>

type TableFormValues = z.infer<typeof formSchema>

interface TableFormProps {
  table: Table | null
  menu: MenuWithIngredients[] | null
  temporder: any
  inventory: Inventory[] | null
}

export const TableForm: React.FC<TableFormProps> = ({ table, menu, temporder, inventory }) => {
  const params = useParams()
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const title = `Edit ${table?.name}`
  const description = `Add menu items to ${table?.name}`
  const toastMessage = `Food added`
  const action = `Add to order`

  const form = useForm<TableFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      menuItem: [],
      quantity: 0,
      tableId: table?.id,
    },
  })

  const order: OrderColumn[] = temporder?.map((item: any) => ({
    id: item.id,
    orderItems: item.orderItems.map((orderItem: any) => orderItem.menuItem.name).join(", "),
    quantity: item.orderItems.map((orderItem: any) => orderItem.quantity),
    isPaid: item.isPaid,
    amount: item.amount,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }))

  const tableStatus = {
    name: table?.name,
    seats: table?.seats,
    status: "Occupied",
  }

  const onSubmit = async (data: TableFormValues) => {
    try {
      setLoading(true)
      await axios.post(`/api/${params.restaurantId}/tableoverview`, data)
      await axios.patch(`/api/${params.restaurantId}/tables/${table?.id}`, tableStatus)
      router.refresh()
      toast.success(toastMessage)

      // Reset form after successful submission
      form.reset({
        menuItem: [],
        quantity: 0,
        tableId: table?.id,
      })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data === "Insufficient Permissions") {
          toast.error("Insufficient permissions")
          return
        }
      }
      if (axios.isAxiosError(error)) {
        if (error.response?.data.includes("Insufficient stock")) {
          toast.error(error.response?.data)
          return
        }
      }
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const updateTable = async () => {
    try {
      await axios.patch(`/api/${params.restaurantId}/tables/${table?.id}`, {
        name: table?.name,
        seats: table?.seats,
        status: "Available",
      })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data === "Insufficient Permissions") {
          toast.error("Insufficient permissions")
          return
        }
      }
      toast.error("Something went wrong")
    }
  }

  useEffect(() => {
    if (order.length === 0) {
      updateTable()
    }
  }, [order.length])

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="flex flex-col gap-6 w-full">
            {/* Hidden form fields that will be updated by the grid component */}
            <div className="hidden">
              <FormField
                control={form.control}
                name="menuItem"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Food Item</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" disabled={loading} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Visual grid component that updates the hidden form fields */}
            <MenuItemGrid menu={menu || []} inventory={inventory || []} form={form} loading={loading} />
          </div>
          <Button disabled={loading} className="ml-auto mt-5" type="submit">
            {action}
          </Button>
          <OrderClient data={order} temporder={temporder} loading={loading} setLoading={setLoading} />
        </form>
      </Form>
    </>
  )
}
