import { NextRequest, NextResponse } from "next/server";
import { POST } from "./types";
import prisma from "@/shared/prisma/db";

export async function POST(req: NextRequest) {
    const { name, email, contNo, department, course, type, eventId, semister }: POST = await req.json();

    if (!name || !email || !contNo || !type || !eventId)
        return NextResponse.json({ error: true, success: false, msg: "unsufficient parimeters", data: null }, { status: 400 });

    try {
        const data = await prisma.event_coordinator.create({ data: { name, email, contNo, department, course, semister, type, eventId } });

        return NextResponse.json({ error: false, success: true, msg: "success", data }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: true, success: false, msg: error.message, data: null }, { status: 400 });
    }
}

