
//DB ORM CLIENT 
import prisma from "@/shared/prisma/db";

// LIBS
import jwt from 'jsonwebtoken';

// TYPES
import { NextRequest, NextResponse } from "next/server";
import { JWTPayloadType } from "../req.types";


export async function GET(req: NextRequest) {
    const headers = new Headers(req.headers);
    const authKey = headers.get('Authorization');

    if (!authKey) return NextResponse.json({ error: true, success: false, msg: "auth token not found", data: null }, { status: 401 });

    try {
        const { id } = jwt.verify(authKey.split(' ')[1], process.env.JWT_SECRET_KEY as string) as JWTPayloadType;
        const user = await prisma.user.findFirst({ where: { id }, select: { id: true, firstName: true, lastName: true, role: true, email: true } });
        return NextResponse.json({ error: false, success: true, msg: "success", data: user }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: true, success: false, msg: error.message, data: null }, { status: 400 });
    }

}

