
import { POST as coordinator } from './coordinator/types';
import { POST as image } from './image/types';

type organizer = "CSCLUB" | "FINANCECLUB" | "HRCLUB" | "MARKETINGCLUB" | "SPANDHAN" | "OTHER";

export type POST = {
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    startTime: Date;
    endTime: Date;
    organizer: organizer;
    coordinators: coordinator[];
    images: image[];
}

export type PUT = POST & {}
