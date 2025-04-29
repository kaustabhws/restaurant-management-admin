"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import type { Member } from "@/components/access-control"
import { Mail, Phone, MoreVertical, Pencil, Trash2, ChevronDown, Shield } from "lucide-react"
import { useState } from "react"

interface MemberCardProps {
  member: Member
  onUpdate: (member: Member) => void
  onDelete: (id: string) => void
}

export function MemberCard({ member, onUpdate, onDelete }: MemberCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Function to get badge color based on role
  const getBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case "manager":
        return "default"
      case "staff":
        return "secondary"
      case "kitchenstaff":
        return "destructive"
      case "waiter":
        return "outline"
      default:
        return "outline"
    }
  }

  // Group permissions by category
  const groupedPermissions: Record<string, string[]> = {}
  member.permissions.forEach((permission) => {
    const category = permission.replace(/View|Create|Update|Delete|Manage/g, "").replace(/s$/, "")
    if (!groupedPermissions[category]) {
      groupedPermissions[category] = []
    }
    groupedPermissions[category].push(permission)
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <CardTitle className="text-base">{member.name}</CardTitle>
            <Badge className="mt-1 w-fit" variant={getBadgeVariant(member.role)}>
              {member.role}
            </Badge>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className={`${member.role === "Admin" ? "hidden" : ""}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onUpdate(member)}>
              <Pencil className="mr-2 h-4 w-4" />
              Update
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(member.id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span>{member.email}</span>
          </div>
          {member.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{member.phone}</span>
            </div>
          )}

          <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-4">
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="flex w-full items-center justify-between p-2">
                <div className="flex items-center">
                  <Shield className="mr-2 h-4 w-4" />
                  <span>Permissions {member.role === "Admin" ? "" : <span>({member.permissions.length})</span>}</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <div className="space-y-2 rounded-md border p-2">
                {Object.entries(groupedPermissions).map(([category, permissions]) => (
                  <div key={category} className="space-y-1">
                    <h4 className="text-xs font-medium text-muted-foreground">{category}</h4>
                    <div className="flex flex-wrap gap-1">
                      {permissions.map((permission) => (
                        <Badge key={permission} variant="secondary" className="text-xs">
                          {permission.replace(/([A-Z])/g, " $1").trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </CardContent>
    </Card>
  )
}
