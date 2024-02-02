type dept = IT | COMMERCE | LAW
type type = FACULTY | STUDENT


export type PUT = {
    name: string;
    email: string;
    contNo: string;
    department?: dept;
    batchStartDate: string;
    batchEndDate: string;
    type: type;
}

export type POST = PUT & {
    eventId: number;
}