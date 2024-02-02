// REACT HOOKS
import { Suspense } from "react";

// NEXTJS CORE
import Link from "next/link";

// DATA COMPONENT
import RecentEvents from "./data";

// UI COMPONENTS
import { Separator } from "@/shared/components/ui/separator";
import { Button, buttonVariants } from "@/shared/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import { cn } from "@/shared/utils/utils";

export default async function page() {
  return (
    <div className="w-full">
      <div className="space-y-4 ">
        <div className="flex items-center justify-between">
          <div className="p-0.5 border inline-flex rounded-lg bg-muted">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white hover:bg-white dark:bg-secondary dark:hover:bg-secondary"
            >
              RECENTS
            </Button>
            <Link
              href="/events"
              className={buttonVariants({ size: "sm", variant: "ghost" })}
            >
              ALL
            </Link>
          </div>

          <Link
            href="/events/create"
            className={cn(
              buttonVariants({ size: "sm", variant: "default" }),
              "space-x-2"
            )}
          >
            <PlusCircleIcon className="h-4 w-4" />
            <span> Create Event</span>
          </Link>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              RECENT EVENTS
            </h2>
            <p className="text-sm text-muted-foreground">
              Checkout the recent events hosted in our campus.
            </p>
          </div>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="grid md:grid-cols-4 gap-4">
        <Suspense fallback={<>Loading</>}>
          <RecentEvents />
        </Suspense>
      </div>
    </div>
  );
}
