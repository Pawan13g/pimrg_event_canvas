import { NextRequest, NextResponse } from "next/server";
import { POST } from "./req.types";
import prisma from "@/shared/prisma/db";

export async function POST(req: NextRequest) {
    const { firstName, lastName, email, contNo, dept, course, type, eventId }: POST = await req.json();

    if (!firstName || !lastName || !email || !contNo || !dept || !course || !type || !eventId)
        return NextResponse.json({ error: true, success: false, msg: "unsufficient parimeters", data: null }, { status: 400 });

    try {
        const data = await prisma.event_coordinator.create({ data: { firstName, lastName, email, contNo, dept, course, type, eventId } });

        return NextResponse.json({ error: false, success: true, msg: "success", data }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: true, success: false, msg: error.message, data: null }, { status: 400 });
    }
}

