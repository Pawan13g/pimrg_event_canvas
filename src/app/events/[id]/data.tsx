// NEXTJS CORE
import Image from "next/image";
import Link from "next/link";

// UI COMPONENTS
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

import { Badge } from "@/shared/components/ui/badge";

import { Button, buttonVariants } from "@/shared/components/ui/button";

import { Separator } from "@/shared/components/ui/separator";

// ICONS
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";

import { BiEditAlt } from "react-icons/bi";

import { CgImage } from "react-icons/cg";

import { HiOutlineDocumentReport } from "react-icons/hi";

// SERVER ACTIONS
import { getEventImagesZipLink, getOneEvent } from "../actions";

// HELPER FUNCTIONS
import { format } from "date-fns";
import { cn, formatTime } from "@/shared/utils/utils";

// TYPES
import { event_coordinator, event_image } from "@prisma/client";

const EventDisplay = async ({ id }: { id: string }) => {
  const { data: event } = await getOneEvent(id);

  const studentCoordinator = event?.coordinators.filter(
    (coordinator: event_coordinator) => coordinator.type === "STUDENT"
  );

  const facultyCoordinator = event?.coordinators.filter(
    (coordinator: event_coordinator) => coordinator.type === "FACULTY"
  );

  return (
    <div className="space-y-6 w-full">
      <div>
        <div className="flex items-center gap-2">
          <Link href="/events/recents">
            <ArrowLeft
              size={20}
              className="hover:scale-125 transition-all hover:text-purple-500"
            />
          </Link>
          <h3 className="text-lg font-medium flex gap-2 items-center">
            {event?.name}
            <Link href={`${id}/edit`}>
              <BiEditAlt className="hover:scale-125 transition-all hover:text-purple-500" />
            </Link>
          </h3>
        </div>
        <p className="text-sm ml-7 text-muted-foreground">
          {event?.description}
        </p>
      </div>

      <Separator />

      <div className="flex flex-col-reverse md:flex-col space-y-4">
        <div className="col-span-7 space-y-4 my-4 md:m-0">
          <h1 className="font-semibold">EVENT IMAGES</h1>
        </div>

        <div className="grid grid-cols-10">
          <div className="overflow-auto md:mr-4 col-span-7">
            <div className="grid md:grid-cols-3 gap-8">
              {event?.images.map((image: event_image, index: number) => (
                <div
                  key={index}
                  className="space-y-3 overflow-hidden rounded-md  border"
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_UPLOAD_DIRECTORY}/${image.url}`}
                    alt={"Event Image"}
                    width={250}
                    height={330}
                    className="h-full w-full object-cover hover:scale-110 aspect-video transition-all"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex col-span-3">
            <Separator
              orientation="vertical"
              className="mr-4 hidden md:block"
            />

            <div className="space-y-4 w-full">
              <form action={getEventImagesZipLink}>
                <input name="id" hidden={true} value={id} />
                <Button type="submit" variant="outline" className="w-full">
                  <CgImage className="text-lg mr-2" />
                  <span>Download Images</span>
                </Button>
              </form>

              <Link
                href={`${process.env.NEXT_PUBLIC_UPLOAD_DIRECTORY}/${event?.report?.url}`}
                className={cn(buttonVariants({ variant: "default" }), "w-full")}
                download={true}
              >
                <HiOutlineDocumentReport className="text-lg mr-2" />
                Download Report
              </Link>

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
    </div>
  );
};

export default EventDisplay;
