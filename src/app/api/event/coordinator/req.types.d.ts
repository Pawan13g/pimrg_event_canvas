type dept = IT | COMMERCE | LAW
type type = FACULTY | STUDENT


export type PUT = {
    firstName: string;
    lastName: string;
    email: string;
    contNo: string;
    dept: dept;
    course: string;
    type: type;
}

export type POST = PUT & {
    eventId: number;
}