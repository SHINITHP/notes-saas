'use client';

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
import { Badge } from "@/components/ui/badge";
import { Search, MoreVertical, Edit, Trash2, Mail, UserPlus } from "lucide-react";
import { toast } from "sonner";


interface Member {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "active" | "inactive";
  joinDate: string;
}

export default function MembersPage() {

  const [searchQuery, setSearchQuery] = useState("");

  const members: Member[] = [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@company.com",
      role: "Senior Developer",
      department: "Engineering",
      status: "active",
      joinDate: "Jan 10, 2024",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@company.com",
      role: "Product Manager",
      department: "Product",
      status: "active",
      joinDate: "Dec 15, 2023",
    },
    {
      id: 3,
      name: "Michael Chen",
      email: "m.chen@company.com",
      role: "UX Designer",
      department: "Design",
      status: "active",
      joinDate: "Nov 22, 2023",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.d@company.com",
      role: "Marketing Manager",
      department: "Marketing",
      status: "inactive",
      joinDate: "Oct 5, 2023",
    },
    {
      id: 5,
      name: "Robert Wilson",
      email: "r.wilson@company.com",
      role: "DevOps Engineer",
      department: "Engineering",
      status: "active",
      joinDate: "Sep 18, 2023",
    },
    {
      id: 6,
      name: "Lisa Anderson",
      email: "lisa.a@company.com",
      role: "HR Manager",
      department: "Human Resources",
      status: "active",
      joinDate: "Aug 30, 2023",
    },
  ];

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAction = (action: string, memberId: number) => {
    const member = members.find((m) => m.id === memberId);
    
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Team Members
          </h1>
          <p className="text-muted-foreground">
            Manage and view all team members
          </p>
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
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <UserPlus /> Invite Member
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Name</TableHead>
                  <TableHead className="text-muted-foreground">Email</TableHead>
                  <TableHead className="text-muted-foreground">Role</TableHead>
                  <TableHead className="text-muted-foreground">Join Date</TableHead>
                  <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id} className="border-border hover:bg-muted/30">
                    <TableCell className="font-medium text-foreground">
                      {member.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {member.email}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {member.role}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {member.joinDate}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-muted"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border-border">
                          {/* <DropdownMenuItem
                            onClick={() => handleAction("Edit", member.id)}
                            className="hover:bg-muted cursor-pointer"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleAction("Email", member.id)}
                            className="hover:bg-muted cursor-pointer"
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem> */}
                          <DropdownMenuItem
                            onClick={() => handleAction("Delete", member.id)}
                            className="hover:bg-destructive/20 text-destructive cursor-pointer"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
