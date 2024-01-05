"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { TableColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"

interface TableClientProps {
    data: TableColumn[]
}

export const TableClient: React.FC<TableClientProps> = ({
    data
}) => {

    const router = useRouter()
    const params = useParams()

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading 
                    title={`Tables (${data.length})`}
                    description="Manage tables for your restaurant"
                />
                <Button onClick={() => router.push(`/${params.restaurantId}/tables/new`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="name" />
        </>
    )
}