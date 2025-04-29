"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Member } from "@/components/access-control";
import {
  PermissionName,
  permissionGroups,
  roleOptions,
} from "@/types/permissions";

const formSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().optional(),
  role: z.enum([
    "Manager",
    "Staff",
    "KitchenStaff",
    "Waiter",
    "Other",
    "Admin",
  ]),
  permissions: z
    .array(z.nativeEnum(PermissionName))
    .min(1, { message: "Select at least one permission." }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddMember: (member: Omit<Member, "id" | "avatar">) => void;
  isEditing?: boolean;
  memberToEdit?: Member | null;
  loading?: boolean;
}

export function AddMemberDialog({
  open,
  onOpenChange,
  onAddMember,
  isEditing = false,
  memberToEdit = null,
  loading,
}: AddMemberDialogProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: memberToEdit?.id || "",
      name: "",
      email: "",
      phone: "",
      role: "Staff",
      permissions: [],
    },
  });

  // Update form values when editing a member
  useEffect(() => {
    if (isEditing && memberToEdit) {
      form.reset({
        name: memberToEdit.name,
        email: memberToEdit.email,
        phone: memberToEdit.phone || "",
        role: memberToEdit.role,
        permissions: memberToEdit.permissions,
      });
    } else if (!isEditing) {
      form.reset({
        name: "",
        email: "",
        phone: "",
        role: "Staff",
        permissions: [],
      });
    }
  }, [form, isEditing, memberToEdit, open]);

  const onSubmit = (values: FormValues) => {
    const finalValues =
      isEditing && memberToEdit?.id
        ? { ...values, id: memberToEdit.id }
        : values;

    onAddMember(finalValues);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Update Member" : "Add New Member"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the member's information below."
              : "Fill in the details to add a new team member."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+1 (555) 123-4567"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roleOptions.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="permissions"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Permissions</FormLabel>
                    <FormMessage />
                  </div>
                  <ScrollArea className="h-[300px] rounded-md border p-4">
                    <Accordion type="multiple" className="w-full">
                      {Object.entries(permissionGroups).map(
                        ([group, permissions]) => (
                          <AccordionItem key={group} value={group}>
                            <AccordionTrigger>{group}</AccordionTrigger>
                            <AccordionContent>
                              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {permissions.map((permission) => (
                                  <FormField
                                    key={permission}
                                    control={form.control}
                                    name="permissions"
                                    render={({ field }) => {
                                      return (
                                        <FormItem
                                          key={permission}
                                          className="flex flex-row items-start space-x-3 space-y-0"
                                        >
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(
                                                permission
                                              )}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([
                                                      ...field.value,
                                                      permission,
                                                    ])
                                                  : field.onChange(
                                                      field.value?.filter(
                                                        (value) =>
                                                          value !== permission
                                                      )
                                                    );
                                              }}
                                            />
                                          </FormControl>
                                          <FormLabel className="font-normal">
                                            {permission
                                              .replace(/([A-Z])/g, " $1")
                                              .trim()}
                                          </FormLabel>
                                        </FormItem>
                                      );
                                    }}
                                  />
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        )
                      )}
                    </Accordion>
                  </ScrollArea>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                disabled={loading}
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {isEditing ? "Update" : "Add"} Member
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
