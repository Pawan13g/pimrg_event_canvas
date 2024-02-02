// REACT HOOKS
import { Suspense, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

// NEXT JS CORE
import Image from "next/image";
import Link from "next/link";

//HTTP  LIBS
import axios from "axios";

import dayjs from "dayjs";

// UI COMPONENTS
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

import { Button, buttonVariants } from "@/shared/components/ui/button";

import { Separator } from "@/shared/components/ui/separator";

import { Badge } from "@/shared/components/ui/badge";

import { DatePickerWithRange } from "@/shared/components/ui/date-range-picker";

import Spinner from "@/shared/components/ui/spin";

// ICONS
import { SlEvent } from "react-icons/sl";

import { CalendarCheck, PlusCircleIcon, Search } from "lucide-react";

import { AiOutlinePlusCircle } from "react-icons/ai";

// ENDPOINTS
import { EVENTS_API, RECENT_EVENTS_API } from "@/shared/constants/endpoint";

// TYPES
import { DateRange } from "react-day-picker";
import { event } from "@prisma/client";
import {
  APIResponse,
  AxiosResponseType,
  EventType,
} from "@/shared/constants/types";
import Events from "./data";
import { cn } from "@/shared/utils/utils";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  return (
    <div className="w-full">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="p-0.5 border inline-flex rounded-lg bg-muted">
            <Link
              href="/events/recents"
              className={buttonVariants({ size: "sm", variant: "ghost" })}
            >
              RECENTS
            </Link>
            <Button
              size="sm"
              variant="secondary"
              className="bg-white hover:bg-white dark:bg-secondary dark:hover:bg-secondary"
            >
              ALL
            </Button>
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
              ALL EVENTS
            </h2>
            <p className="text-sm text-muted-foreground">
              Checkout all the events hosted in our campus.
            </p>
          </div>
        </div>
      </div>

      <Separator className="my-4" />
      <div className="grid md:grid-cols-4 gap-4">
        <Suspense fallback={<>Loading</>}>
          <Events searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}
