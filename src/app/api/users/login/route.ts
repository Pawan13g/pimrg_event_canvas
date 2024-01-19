//DB ORM CLIENT 
import prisma from "@/shared/prisma/db";

// LIBS
import jwt from 'jsonwebtoken';

// TYPES
import { NextRequest, NextResponse } from "next/server";
import { LoginType } from "../req.types";


export async function POST(req: NextRequest) {
    const { email, password }: LoginType = await req.json();

    if (!email || !password)
        return NextResponse.json({ error: true, success: false, msg: "unsufficient parimeters", data: null }, { status: 400 });

    try {
        const user = await prisma.user.findFirst({ where: { email, password } });

        if (!user)
            return NextResponse.json({ error: true, success: false, msg: "invalid credentials", data: null }, { status: 401 });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY as string, { expiresIn: '1d' })


        return NextResponse.json({ error: false, success: true, msg: "success", data: { authKey: token } }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: true, success: false, msg: error.message, data: null }, { status: 400 });
    }
}

