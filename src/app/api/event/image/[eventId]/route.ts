// ORM CLIENT
import prisma from "@/shared/prisma/db";

// NEXTJS TYPES
import { NextRequest, NextResponse } from "next/server";

// IO LIBS
import fs from 'fs';
import path from "path";

// LOCAL TYPES
import { POST } from "../types";

export async function GET(req: NextRequest, { params: { eventId } }: { params: { eventId: number } }) {

    try {
        if (!eventId)
            return NextResponse.json({ error: true, success: false, msg: "unsufficient parimeters", data: null }, { status: 400 });

        const data = await prisma.event_image.findMany({ where: { eventId: Number(eventId), isActive: true }, include: { event: true } });

        if (!data)
            return NextResponse.json({ error: true, success: false, msg: `no image found for eventID: ${eventId}`, data: null }, { status: 400 });

        return NextResponse.json({ error: false, success: true, msg: "success", data }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: true, success: false, msg: error.message, data: null }, { status: 400 });
    }
}

export async function POST(req: NextRequest, { params: { eventId } }: { params: { eventId: number } }) {
    const { images }: { images: POST[] } = await req.json();

    try {

        if (!images.length)
            return NextResponse.json(
                { error: true, success: false, msg: "unsufficient parimeters", data: null }, { status: 400 }
            );

        images.map(async ({ url, name }: POST) => {
            const buffer = Buffer.from(url.split(",")[1], 'base64');
            const imageRelativePath = `uploads/images/${name}`
            const outputPath = path.join(process.cwd(), 'public', imageRelativePath);
            fs.writeFileSync(outputPath, buffer);
            await prisma.event_image.create({ data: { name: name, url: imageRelativePath, eventId: Number(eventId) } });
        })

        return NextResponse.json({ error: false, success: true, msg: "success", data: null }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: true, success: false, msg: error.message, data: null }, { status: 400 });
    }
}

// export async function POST(req: NextRequest, { params: { eventId } }: { params: { eventId: number } }) {
//     const images: POST[] = await req.json();

//     if (!images.length)
//         return NextResponse.json(
//             { error: true, success: false, msg: "unsufficient parimeters", data: null }, { status: 400 }
//         );

//     const result: any[] = [];

//     try {
//         images.map(async (image: POST) => {
//             await prisma.event_image.create({ data: { name: image.name, url: image.url, eventId } });
//         });

//         return NextResponse.json({ error: false, success: true, msg: "success", data: result }, { status: 200 });

//     } catch (error: any) {
//         return NextResponse.json({ error: true, success: false, msg: error.message, data: null }, { status: 400 });
//     }
// }


export async function DELETE(req: Request, { params: { eventId } }: { params: { eventId: number } }) {

    if (!eventId)
        return NextResponse.json({ error: true, success: false, msg: "unsufficient parimeters", data: null }, { status: 400 });

    try {
        const event = await prisma.event_image.updateMany({ where: { eventId: Number(eventId) }, data: { isActive: false } });

        return NextResponse.json({ error: false, success: true, msg: "success", data: { event } }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: true, success: false, msg: error.message, data: null }, { status: 400 });
    }
}
