"use client"

import { useState } from "react"
import Image from "next/image"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type InventoryItem = {
  id: string
  availableQuantity: number
}

type MenuIngredient = {
  inventoryId: string
  quantityUsed: number
}

type MenuItem = {
  id: string
  name: string
  price: number
  images: { url: string }[]
  ingredients: MenuIngredient[]
}

type MenuItemGridProps = {
  menu: MenuItem[]
  inventory: InventoryItem[]
  form: any
  loading: boolean
}

export function MenuItemGrid({ menu, inventory, form, loading }: MenuItemGridProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [quantity, setQuantity] = useState<number>(0)

  // Filter menu items based on search query
  const filteredMenuItems = menu?.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase())) || []

  // Check if a menu item is in stock
  const isInStock = (menuItem: MenuItem) => {
    return menuItem.ingredients.every((ingredient) => {
      const inventoryItem = inventory?.find((inv) => inv.id === ingredient.inventoryId)
      return inventoryItem && inventoryItem.availableQuantity >= ingredient.quantityUsed
    })
  }

  // Add item to cart
  const addToCart = (item: MenuItem) => {
    if (!isInStock(item)) return

    // Update selected item
    setSelectedItem(item.id)
    setQuantity(1)

    // Update form values
    form.setValue("menuItem", item.id)
    form.setValue("quantity", 1)
  }

  // Update item quantity
  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setSelectedItem(null)
      setQuantity(0)
      form.setValue("menuItem", "")
      form.setValue("quantity", 0)
      return
    }

    setQuantity(newQuantity)
    form.setValue("menuItem", itemId)
    form.setValue("quantity", newQuantity)
  }

  return (
    <div className="space-y-6">
      {/* Search section */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search food items..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Food items grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredMenuItems.map((item) => {
          const itemInStock = isInStock(item)
          const isSelected = selectedItem === item.id

          return (
            <Card key={item.id} className={cn("overflow-hidden", !itemInStock && "opacity-70")}>
              <div className="aspect-square relative">
                {!itemInStock && (
                  <div className="absolute inset-0 bg-background/80 z-10 flex items-center justify-center">
                    <span className="bg-destructive text-destructive-foreground px-2 py-1 text-xs font-medium rounded">
                      Out of Stock
                    </span>
                  </div>
                )}
                <Image
                  src={item.images[0]?.url || "/placeholder.svg?height=200&width=200"}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-sm">{item.name}</h3>
                  <span className="font-bold text-sm">${item.price.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="p-3 pt-0">
                {!isSelected ? (
                  <Button
                    className="w-full text-xs py-1 h-8"
                    onClick={() => addToCart(item)}
                    disabled={!itemInStock || loading}
                  >
                    Add to Cart
                  </Button>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.id, quantity - 1)}
                      disabled={loading}
                      type="button"
                    >
                      -
                    </Button>
                    <span className="text-sm font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.id, quantity + 1)}
                      disabled={!itemInStock || loading}
                      type="button"
                    >
                      +
                    </Button>
                  </div>
                )}
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
