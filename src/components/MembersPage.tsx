"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreVertical, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { UserData } from "@/lib/types";
import { InviteUserModal } from "./invites/InviteUserModal";

interface MembersPageProps {
  initialUsers: UserData[];
}

export default function MembersPage({ initialUsers }: MembersPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState(initialUsers);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInvite = async (data: { email: string; role: "ADMIN" | "MEMBER" }) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success("Invitation sent successfully!");
      setIsInviteModalOpen(false);
    } catch (error) {
      toast.error((error as Error).message || "Failed to send invitation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      setUsers(users.filter((u) => u.id !== userId));
      toast.success("User deleted successfully!");
    } catch (error) {
      toast.error((error as Error).message || "Failed to delete user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container px-4">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Team Members</h1>
          <p className="text-muted-foreground">Manage and view all team members</p>
        </header>

        <div className="bg-card rounded-lg shadow-lg border border-border">
          <div className="p-6 border-b border-border">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-input"
                />
              </div>
              <Button
                onClick={() => setIsInviteModalOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isLoading}
              >
                <UserPlus className="mr-2 h-4 w-4" /> Invite Member
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Email</TableHead>
                  <TableHead className="text-muted-foreground">Role</TableHead>
                  <TableHead className="text-muted-foreground">Join Date</TableHead>
                  <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No members found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-border hover:bg-muted/30">
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell className="text-foreground">{user.role}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.createdAt?.getDate()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:bg-muted">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover border-border">
                            <DropdownMenuItem
                              onClick={() => handleDelete(user.id)}
                              className="hover:bg-destructive/20 text-destructive cursor-pointer"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <InviteUserModal
        open={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
        onSave={handleInvite}
      />
    </div>
  );
}