import { JwtPayload } from "jsonwebtoken";

export type UserRequestType = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export type LoginType = {
    email: string;
    password: string;
}

export type JWTPayloadType = JwtPayload & {
    id: string;
}
