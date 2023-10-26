//DB ORM CLIENT 
import prisma from "@/shared/prisma/db";

// LIBS
import jwt from 'jsonwebtoken';

// TYPES
import { NextRequest, NextResponse } from "next/server";
import { UserRequestType } from "./req.types";




export async function POST(req: NextRequest) {
    const { firstName, lastName, email, password }: UserRequestType = await req.json();

    if (!firstName || !lastName || !email || !password)
        return NextResponse.json({ error: true, success: false, msg: "unsufficient parimeters", data: null }, { status: 400 });

    try {
        const result = await prisma.user.create({ data: { firstName, lastName, email, password } });
        return NextResponse.json({ error: false, success: true, msg: "user created", data: result }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ error: true, success: false, msg: error.message, data: null }, { status: 400 });
    }
}

