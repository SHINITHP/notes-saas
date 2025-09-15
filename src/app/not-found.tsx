import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
      <div className="container mx-auto px-4 text-center">
        <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-foreground mb-2">404 - Page Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The page you are looking for does not exist or you do not have permission to access it.
        </p>
        <Link href="/notes">
          <Button variant="default">Return to Notes</Button>
        </Link>
      </div>
    </div>
  );
}