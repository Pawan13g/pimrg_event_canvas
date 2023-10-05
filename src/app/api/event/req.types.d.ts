
type organizer = "CSCLUB" | "FINANCECLUB" | "HRCLUB" | "MARKETINGCLUB" | "SPANDHAN" | "OTHER"

export type POST = {
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    startTime: Date;
    endTime: Date;
    organizedBY: organizer;
}
