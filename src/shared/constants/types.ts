import { coordinator, event, event_coordinator, event_image, event_report } from "@prisma/client";
import { AxiosResponse } from "axios";

export type APIResponse<T> = {
    error: boolean,
    success: boolean,
    msg: string,
    data: T
}

export type AxiosResponseType<T> = AxiosResponse<APIResponse<T>>



export type EventType = event & {
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    images: event_image[];
    coordinators: event_coordinator[];
    report: event_report;
}



