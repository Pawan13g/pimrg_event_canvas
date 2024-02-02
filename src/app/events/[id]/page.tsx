// NEXTJS CORE
import Image from "next/image";
import Link from "next/link";

// HOOKS
import { useMemo, useEffect, Suspense } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

// HTTP LIBS
import axios, { AxiosResponse } from "axios";

// ENDPOINTS
import { EVENTS_API } from "@/shared/constants/endpoint";

// UI COMPONENTS

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

import { buttonVariants } from "@/shared/components/ui/button";

import { Badge } from "@/shared/components/ui/badge";

import { Separator } from "@/shared/components/ui/separator";

import { APIResponse, EventType } from "@/shared/constants/types";

// ICONS
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";

import { CgImage } from "react-icons/cg";

import { HiOutlineDocumentReport } from "react-icons/hi";

import { BiEditAlt } from "react-icons/bi";

// TYPES
import { RootState } from "@/shared/rdx/store";
import { event_coordinator, event_image } from "@prisma/client";
import Spinner from "@/shared/components/ui/spin";
import { format } from "date-fns";
import { cn, formatTime } from "@/shared/utils/utils";
import EventDisplay from "./data";

const fetchEvent = async (id: string) => {
  try {
    const response: AxiosResponse<APIResponse<EventType>> = await axios.get(
      `${EVENTS_API}/${id}`
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export default function EventPage({
  params: { id },
  searchParams: { event: eventName },
}: {
  params: { id: string };
  searchParams: { event: string };
}) {
  // HOOKS INSTANCES
  // STORE DATA
  // const { user } = useSelector((state: RootState) => state.session);

  // // PROPS DATA
  // const {
  //   data: event,
  //   isLoading,
  //   isError,
  //   error,
  // } = useQuery(["event", id], () => fetchEvent(id));

  // useEffect(() => {
  //   if (isError) throw new Error();
  // }, [isError, error]);

  // const studentCoordinator = useMemo(() => {
  //   return event?.coordinators.filter(
  //     (coordinator: event_coordinator) => coordinator.type === "STUDENT"
  //   );
  // }, [event]);

  // const facultyCoordinator = useMemo(() => {
  //   return event?.coordinators.filter(
  //     (coordinator: event_coordinator) => coordinator.type === "FACULTY"
  //   );
  // }, [event]);

  return (
    <Suspense
      fallback={
        <div className="space-y-4 w-full">
          <div>
            <div className="flex items-center gap-2">
              <ArrowLeft
                size={20}
                className="hover:scale-125 transition-all hover:text-purple-500"
                // onClick={() => router.back()}
              />
              <h3 className="text-lg font-medium flex gap-2 items-center">
                {eventName}
                <BiEditAlt className="hover:scale-125 transition-all hover:text-gray-400 cursor-not-allowed" />
              </h3>
            </div>
          </div>
          <Separator />
          <div>Loading</div>
        </div>
      }
    >
      <EventDisplay id={id} />
    </Suspense>
  );
}
