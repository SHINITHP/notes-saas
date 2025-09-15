"use client";

import { Crown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UserData } from "@/lib/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PlanLimitBannerProps {
  tenant: { id: string; slug: string; isPro: boolean };
  user: UserData;
}

export function PlanLimitBanner({ tenant, user }: PlanLimitBannerProps) {
  useEffect(() => {
    const fetchNoteCount = async () => {
      try {
        const res = await fetch("/api/notes", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch notes");
      } catch {
        toast.error("Failed to fetch note count");
      }
    };
    fetchNoteCount();
  }, []);

  const handleUpgrade = async () => {
    try {
      const res = await fetch(`/api/tenants/${tenant.slug}/upgrade`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success("Upgraded to Pro! You can now create unlimited notes.");
      window.location.reload();
    } catch (error) {
      toast.error((error as Error).message || "Failed to upgrade");
    }
  };

  if (!tenant.isPro) {
    return (
      <Card className="border border-yellow-300/50 dark:border-white/10 bg-yellow-50 dark:bg-[#1a1a1a] animate-fade-in mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Left Side */}
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-yellow-100 dark:bg-white/10">
                <Crown className="h-5 w-5 text-yellow-600 dark:text-yellow-300" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-yellow-900 dark:text-white">
                  You&apos;ve reached your note limit
                </h3>
                <p className="text-sm text-yellow-800/90 dark:text-muted-foreground mt-1">
                  Upgrade to Pro to create unlimited notes and unlock premium
                  features.
                </p>
              </div>
            </div>
            {user.role === "ADMIN" && (
              <Button
                onClick={handleUpgrade}
                variant="secondary"
                className="shrink-0 flex items-center gap-2"
              >
                Upgrade to Pro
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
