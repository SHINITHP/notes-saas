"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const schema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function AcceptInvitationPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { password: "" },
  });

  const onSubmit = async (data: { password: string }) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/invitations/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: data.password }),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success("Account created! Please log in.");
      router.push("/login");
    } catch (error) {
      toast.error((error as Error).message || "Failed to accept invitation");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return <div className="container mx-auto p-4">Invalid invitation link</div>;
  }

  return (
    <div className=" h-screen flex justify-center items-center">
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Accept Invitation</h1>
      <p className="text-muted-foreground mb-6">Set your password to join the team.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password..."
            {...register("password")}
            className="bg-slate-100 dark:bg-[#2a2a2a] border-border/50"
            aria-invalid={errors.password ? "true" : "false"}
          />
          {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
        </div>
        <Button type="submit" disabled={isLoading} variant="default" className="w-full">
          {isLoading ? "Processing..." : "Set Password"}
        </Button>
      </form>
    </div>
    </div>
  );
}