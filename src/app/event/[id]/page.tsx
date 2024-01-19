"use client";

// NEXTJS CORE
import Image from "next/image";
import Link from "next/link";

// HOOKS
import { useMemo, useEffect } from "react";
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
import { useImageDialog } from "@/shared/components/ui/image-dialog";
import { format } from "date-fns";
import { cn, formatTime } from "@/shared/utils/utils";

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
}: {
  params: { id: string };
}) {
  // HOOKS INSTANCES
  const router = useRouter();
  const { ImageDialog, setImage } = useImageDialog();

  // STORE DATA
  const { user } = useSelector((state: RootState) => state.session);

  // PROPS DATA
  const {
    data: event,
    isLoading,
    isError,
    error,
  } = useQuery(["event", id], () => fetchEvent(id));

  useEffect(() => {
    if (isError) throw new Error();
  }, [isError, error]);

  const studentCoordinator = useMemo(() => {
    return event?.coordinators.filter(
      (coordinator: event_coordinator) => coordinator.type === "STUDENT"
    );
  }, [event]);

  const facultyCoordinator = useMemo(() => {
    return event?.coordinators.filter(
      (coordinator: event_coordinator) => coordinator.type === "FACULTY"
    );
  }, [event]);

  return isLoading ? (
    <Spinner />
  ) : (
    <>
      <div className="space-y-6 w-full">
        <div>
          <div className="flex items-center gap-2">
            <ArrowLeft
              size={20}
              className="hover:scale-125 transition-all hover:text-purple-500"
              onClick={() => router.back()}
            />
            <h3 className="text-lg font-medium flex gap-2 items-center">
              {event?.name.toUpperCase()}
              {user && (
                <Link className="relative group" href={`${id}/edit`}>
                  <BiEditAlt className="hover:scale-125 transition-all hover:text-purple-500" />
                </Link>
              )}
              <Link className="relative group" href={`${id}/edit`}>
                <BiEditAlt className="hover:scale-125 transition-all hover:text-purple-500" />
              </Link>
            </h3>
          </div>
          <p className="text-sm ml-7 text-muted-foreground">
            {event?.description}
          </p>
        </div>

        <Separator />

        <div className="flex flex-col-reverse md:grid md:grid-cols-10">
          <div className="col-span-7 space-y-4 my-4 md:m-0">
            <h1 className="font-semibold">EVENT IMAGES</h1>

            <div className="overflow-auto md:mr-4">
              <div className="grid md:grid-cols-3 gap-8">
                {event?.images.map((image: event_image, index: number) => (
                  <div
                    key={index}
                    className="space-y-3 overflow-hidden rounded-md  border"
                  >
                    <Image
                      src={`${process.env.NEXT_PUBLIC_UPLOAD_DIRECTORY}/${image.url}`}
                      alt={"Event Image"}
                      onClick={() =>
                        setImage(
                          `${process.env.NEXT_PUBLIC_UPLOAD_DIRECTORY}/${image.url}`
                        )
                      }
                      width={250}
                      height={330}
                      className="h-full w-full object-cover hover:scale-110 aspect-video transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex col-span-3">
            <Separator
              orientation="vertical"
              className="mr-4 hidden md:block"
            />

            <div className="space-y-4 w-full">
              <Link
                href={`${id}/images-download`}
                className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                target="_blank"
              >
                <CgImage className="text-lg mr-2" />
                Download Images
              </Link>

              <a
                href={`${process.env.NEXT_PUBLIC_UPLOAD_DIRECTORY}/${event?.report.url}`}
                className={cn(buttonVariants({}), "w-full")}
                download={true}
              >
                <HiOutlineDocumentReport className="text-lg mr-2" />
                Download Report
              </a>

              <Separator className="my-4" />

              <Tabs defaultValue="coordinators" className="w-full space-y-6">
                <TabsList className="w-full">
                  <TabsTrigger className="w-full" value="coordinators">
                    EVENT COORDINATORS
                  </TabsTrigger>
                  <TabsTrigger className="w-full" value="info">
                    EVENT INFO
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="coordinators" className="px-2 outline-none">
                  <div className="space-y-3">
                    <h4 className="text-sm text-gray-600 dark:text-primary-foreground font-medium">
                      FACULTY COORDINATORS
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {facultyCoordinator?.map(
                        (coordinator: event_coordinator, index) => (
                          <Badge
                            key={index}
                            className="text-[10px]"
                            color="gold"
                          >
                            {coordinator.name}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-3">
                    <h4 className="text-sm text-gray-600 dark:text-primary-foreground font-medium">
                      STUDENT COORDINATORS
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {studentCoordinator?.map(
                        (coordinator: event_coordinator, index) => (
                          <Badge
                            key={index}
                            className="text-[10px]"
                            color="red"
                          >
                            {coordinator.name}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent
                  value="info"
                  className="h-full flex-col border-none p-0 data-[state=active]:flex"
                >
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="text-purple-600" size={18} />
                      <Separator className="w-0.5 h-5" orientation="vertical" />
                      <span className="font-medium text-sm text-gray-600 dark:text-primary-foreground">
                        START DATE
                      </span>
                    </div>

                    <div className="text-sm">
                      {event ? (
                        format(new Date(event.startDate), "PPP")
                      ) : (
                        <>N/A</>
                      )}
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="text-purple-600" size={18} />
                      <Separator className="w-0.5 h-5" orientation="vertical" />
                      <span className="font-medium text-sm text-gray-600 dark:text-primary-foreground">
                        END DATE
                      </span>
                    </div>

                    <div className="text-sm">
                      {event ? (
                        format(new Date(event.endDate), "PPP")
                      ) : (
                        <>N/A</>
                      )}
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="text-purple-600" size={18} />
                      <Separator className="w-0.5 h-5" orientation="vertical" />
                      <span className="font-medium text-sm text-gray-600 dark:text-primary-foreground">
                        START TIME
                      </span>
                    </div>

                    <div className="text-sm">
                      {event ? formatTime(event.startTime) : <>N/A</>}
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="text-purple-600" size={18} />
                      <Separator className="w-0.5 h-5" orientation="vertical" />
                      <span className="font-medium text-sm text-gray-600 dark:text-primary-foreground">
                        END TIME
                      </span>
                    </div>

                    <div className="text-sm">
                      {event ? formatTime(event.endTime) : <>N/A</>}
                    </div>
                  </div>

                  <Separator className="my-4" />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      <ImageDialog />
    </>
  );
}
