"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus } from "lucide-react";

const schema = z.object({
  email: z.string().email("Invalid email"),
  role: z.enum(["ADMIN", "MEMBER"]),
});

interface InviteUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: { email: string; role: "ADMIN" | "MEMBER" }) => void;
}

export function InviteUserModal({ open, onOpenChange, onSave }: InviteUserModalProps) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", role: "MEMBER" as "ADMIN" | "MEMBER" },
  });

  const onSubmit = async (data: { email: string; role: "ADMIN" | "MEMBER" }) => {
    await onSave(data);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md dark:bg-[#1a1a1a] animate-fade-in border border-border shadow-glow animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <UserPlus className="h-5 w-5 text-primary" />
            Invite User
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Invite a new user to join your team.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter email..."
                      {...field}
                      className="bg-slate-100 dark:bg-[#2a2a2a] border-border/50"
                      aria-invalid={form.formState.errors.email ? "true" : "false"}
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
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="bg-slate-100 dark:bg-[#2a2a2a] border-border/50">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MEMBER">Member</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={form.formState.isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting} variant="default">
                <UserPlus className="h-4 w-4 mr-2" />
                Send Invite
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}