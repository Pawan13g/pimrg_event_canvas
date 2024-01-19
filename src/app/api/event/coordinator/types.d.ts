type dept = IT | COMMERCE | LAW
type type = FACULTY | STUDENT


export type PUT = {
    name: string;
    email: string;
    contNo: string;
    department?: dept;
    course?: string;
    semister?: string;
    type: type;
}

export type POST = PUT & {
    eventId: number;
}