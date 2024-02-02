// NEXT JS CORE
import Image from "next/image";
import Link from "next/link";

// DATE LIBS
import dayjs from "dayjs";

// UI COMPONENTS
import { Badge } from "@/shared/components/ui/badge";

// ACTIONS
import { getAllEvents } from "./actions";

// TYPES
import Empty from "@/shared/components/ui/empty";

type Props = {
  searchParams: { [key: string]: string | undefined };
};

const Events = async ({ searchParams }: Props) => {
  const { data: events } = await getAllEvents(searchParams);

  return events?.length ? (
    events.map((event, index: number) => (
      <Link
        key={index}
        href={`events/${event.id}?event=${encodeURIComponent(event.name)}`}
      >
        <div className="space-y-3">
          <div className="overflow-hidden rounded-md border">
            <Image
              src={`${process.env.NEXT_PUBLIC_UPLOAD_DIRECTORY}/${event.coverImage?.url}`}
              alt={"Event Image"}
              width={250}
              height={330}
              className="h-full w-full object-cover transition-all hover:scale-105 aspect-video"
            />
          </div>
          <div className="space-y-1 ml-2 text-sm">
            <h3 className="font-medium leading-none">{event.name}</h3>
            <div className="flex gap-2 items-center">
              <p className="text-xs text-muted-foreground">{event.organizer}</p>
              <Badge className="text-[10px] dark:bg-purple-500" color="grey">
                {dayjs(event.startDate).format("MMM D, YYYY")}
              </Badge>
            </div>
          </div>
        </div>
      </Link>
    ))
  ) : (
    <Empty title="No events has are created" />
  );
};

export default Events;
