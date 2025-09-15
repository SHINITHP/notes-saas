"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogOut } from "lucide-react";
import { ModeToggle } from "./mode-toogle";

interface PageWrapperProps {
  children: React.ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Logout failed");
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      console.log(error)
      toast.error("Failed to log out");
    }
  };

  return (
    <div>
      <header className="flex justify-between pr-10 border-b h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
        </div>
        <div className="flex gap-4">
          <ModeToggle />
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>
      <div className="flex flex-1 px-6 py-5">{children}</div>
    </div>
  );
}