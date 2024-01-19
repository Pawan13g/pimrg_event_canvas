
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/shared/prisma/db";


export async function GET(req: NextRequest, { params: { eventId, imageId } }: { params: { eventId: number, imageId: number } }) {

    try {
        if (!eventId || !imageId)
            return NextResponse.json({ error: true, success: false, msg: "unsufficient parimeters", data: null }, { status: 400 });

        const data = await prisma.event_image.findMany({ where: { eventId: Number(eventId), isActive: true, id: Number(imageId) } });

        if (!data)
            return NextResponse.json({ error: true, success: false, msg: `no image found: ${eventId}`, data: null }, { status: 400 });

        return NextResponse.json({ error: false, success: true, msg: "success", data }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: true, success: false, msg: error.message, data: null }, { status: 400 });
    }
}

export async function DELETE(req: Request, { params: { eventId, imageId } }: { params: { eventId: number, imageId: number } }) {

    if (!eventId)
        return NextResponse.json({ error: true, success: false, msg: "unsufficient parimeters", data: null }, { status: 400 });

    try {
        const event = await prisma.event_image.updateMany({ where: { eventId: Number(eventId), id: Number(imageId) }, data: { isActive: false } });

        return NextResponse.json({ error: false, success: true, msg: "success", data: { event } }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: true, success: false, msg: error.message, data: null }, { status: 400 });
    }
}