import { coordinator, event, event_coordinator, event_image } from "@prisma/client";

export type APIResponse<T> = {
    error: boolean,
    success: boolean,
    msg: "string",
    data: T
}


export type EventType = event & {
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    images: event_image[];
    coordinators: event_coordinator[];
}

