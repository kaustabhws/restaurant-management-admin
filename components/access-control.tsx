"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AddMemberDialog } from "@/components/add-member-dialog";
import { MemberCard } from "@/components/member-card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PermissionName, type Role } from "@/types/permissions";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Heading } from "./ui/heading";

export type Admin = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  permissions: PermissionName[];
};

export type Member = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: Role;
  permissions: PermissionName[];
};

interface AccessControlProps {
  admin: Admin;
  members: Member[];
  resId: string;
}

const AccessControl: React.FC<AccessControlProps> = ({
  admin,
  members,
  resId,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<Member | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleEdit = (member: Member) => {
    setIsEditing(true);
    setMemberToEdit(member);
    setDialogOpen(true);
  };

  const handleMemberSubmit = async (member: any) => {
    try {
      setLoading(true);
      if (isEditing) {
        const response = await axios.patch(
          `/api/${resId}/access-control/${member.id}`,
          member
        );
        if (response.status === 200) {
          toast.success("Member updated successfully.");
        }
      } else {
        const response = await axios.post(
          `/api/${resId}/access-control`,
          member
        );
        if (response.status === 200) {
          toast.success("Member added successfully.");
        }
      }
      router.refresh();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setDialogOpen(false);
      setIsEditing(false);
      setMemberToEdit(null);
      setLoading(false);
    }
  };

  return (
    <Card className="w-full border-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <Heading
            title="Access Control"
            description="Manage team members and their access permissions."
          />
        </div>
        <Button
          onClick={() => {
            setDialogOpen(true);
          }}
        >
          Add Member
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <MemberCard member={admin} onUpdate={() => {}} onDelete={() => {}} />
          {members.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onUpdate={() => handleEdit(member)}
              onDelete={() => {}}
            />
          ))}
        </div>
      </CardContent>

      <AddMemberDialog
        loading={loading}
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) {
            setIsEditing(false);
            setMemberToEdit(null);
          }
        }}
        onAddMember={(member) => handleMemberSubmit(member)}
        isEditing={isEditing}
        memberToEdit={memberToEdit}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the
              member from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {}}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export { AccessControl };
