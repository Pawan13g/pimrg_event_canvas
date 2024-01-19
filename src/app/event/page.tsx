// REACT HOOKS
import { useEffect, useState } from "react";
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

import { Button } from "@/shared/components/ui/button";

import { Separator } from "@/shared/components/ui/separator";

import { Badge } from "@/shared/components/ui/badge";

import { DatePickerWithRange } from "@/shared/components/ui/date-range-picker";

import Spinner from "@/shared/components/ui/spin";

// ICONS
import { SlEvent } from "react-icons/sl";

import { CalendarCheck, Search } from "lucide-react";

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

const getEvents = async (searchParams: { [key: string]: string | undefined }) => {

  const { name, to, from } = searchParams;

  const endpoint = new URL(EVENTS_API);

  if (name || to || from) {
    if (name) endpoint.searchParams.append("name", name);

    if (to && from) {
      endpoint.searchParams.append("to", to);
      endpoint.searchParams.append("from", from);
    }
  }

  const response: APIResponse<EventType[]> = await fetch(
    endpoint, {
    next: { tags: ["events"] },
  }).then((response) => response.json());

  return response.data;
};

export default async function Home({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const events = await getEvents(searchParams);

  return (
    <Tabs defaultValue="recents" className="h-full w-full space-y-6">
      <div className="space-between flex items-center">
        <TabsList>
          <Link href="/">
            <TabsTrigger value="recents" className="relative">
              Recent
            </TabsTrigger>
          </Link>
          <Link href="?eventsType=all">
            <TabsTrigger value="all">All</TabsTrigger>
          </Link>
        </TabsList>
        <div className="ml-auto mr-4">
          <Link href="/event/create">
            <Button>
              <AiOutlinePlusCircle className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </Link>
        </div>
      </div>
      <TabsContent value="recents" className="border-none p-0 outline-none">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              RECENT EVENTS
            </h2>
            <p className="text-sm text-muted-foreground">
              Checkout our recent events in our campus.
            </p>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="grid md:grid-cols-4 gap-4">
          {events?.length ? (
            events.map((event: event, index: number) => (
              <Link key={index} href={`event/${event.id}`}>
                <div className="space-y-3">
                  <div className="overflow-hidden rounded-md border">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_UPLOAD_DIRECTORY}/${event.coverImageURL}`}
                      alt={"Event Image"}
                      width={250}
                      height={330}
                      className="h-full w-full object-cover transition-all hover:scale-105 aspect-video"
                    />
                  </div>
                  <div className="space-y-1 ml-2 text-sm">
                    <h3 className="font-medium leading-none">{event.name}</h3>
                    <div className="flex gap-2 items-center">
                      <p className="text-xs text-muted-foreground">
                        {event.organizer}
                      </p>
                      <Badge
                        className="text-[10px] dark:bg-purple-500"
                        color="grey"
                      >
                        {dayjs(event.startDate).format("MMM D, YYYY")}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="flex justify-center items-center border gap-4 rounded-md w-full col-span-4 flex-col p-4 h-[300px]">
              <CalendarCheck strokeWidth={1} size={80} />
              <span>No events found</span>
            </div>
          )}
        </div>
      </TabsContent>
      <TabsContent
        value="all"
        className="h-full flex-col border-none p-0 data-[state=active]:flex"
      >
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              ALL EVENTS
            </h2>
            <p className="text-sm text-muted-foreground">
              All event hosted in campus till now
            </p>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="grid md:grid-cols-4 gap-4">
          {events?.length ? (
            events.map((event: event, index: number) => (
              <Link key={index} href={`event/${event.id}`}>
                <div className="space-y-3">
                  <div className="overflow-hidden rounded-md border">
                    <Image
                      src={`${process.env.NEXT_PUBLIC_UPLOAD_DIRECTORY}/${event.coverImageURL}`}
                      alt={"Event Image"}
                      width={250}
                      height={330}
                      className="h-full w-full object-cover transition-all hover:scale-105 aspect-video"
                    />
                  </div>
                  <div className="space-y-1 ml-2 text-sm">
                    <h3 className="font-medium leading-none">{event.name}</h3>
                    <div className="flex gap-2 items-center">
                      <p className="text-xs text-muted-foreground">
                        {event.organizer}
                      </p>
                      <Badge className="text-[10px]" color="grey">
                        {dayjs(event.startDate).format("MMM D, YYYY")}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="flex justify-center items-center border gap-4 rounded-md w-full col-span-4 flex-col p-4 h-[300px]">
              <CalendarCheck strokeWidth={1} size={80} />
              <span>No events found</span>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
