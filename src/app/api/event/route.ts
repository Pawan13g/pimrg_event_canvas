import { NextRequest, NextResponse } from "next/server";
import { POST } from "./req.types";
import prisma from "@/shared/prisma/db";



export async function GET() {

    try {
        const data = await prisma.event.findMany({ where: { isActive: true }, include: { event_image: true, coordinatedBy: true } })
        return NextResponse.json({ error: false, success: true, msg: "success", data }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: true, success: false, msg: error.message, data: null }, { status: 400 });
    }
}



export async function POST(req: NextRequest) {
    const { eventName, eventAuthority, eventDescription, eventFrom, eventTo, eventStartTime, eventEndTime, eventDisplayImageURL: dummyImage }: POST = await req.json();

    let eventDisplayImageURL = dummyImage ? dummyImage : process.env.DUMMY_IMAGE_URL as string;

    if (!eventName || !eventAuthority || !eventDescription || !eventFrom || !eventTo || !eventStartTime || !eventEndTime)
        return NextResponse.json({ error: true, success: false, msg: "unsufficient parimeters", data: null }, { status: 400 });

    try {
        const data = await prisma.event.create({ data: { eventName, eventAuthority, eventDescription, eventFrom, eventTo, eventStartTime, eventEndTime, eventDisplayImageURL } });

        return NextResponse.json({ error: false, success: true, msg: "success", data }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ error: true, success: false, msg: error.message, data: null }, { status: 400 });
    }
}

