import { NextRequest, NextResponse } from "next/server";
import { POST } from "./types";
import path from "path";
import fs from 'fs'

export async function POST(req: NextRequest) {
    const { name, base64String, eventId }: POST = await req.json();

    if (!name || !base64String || !eventId)
        return NextResponse.json({ error: true, success: false, msg: "unsufficient parimeters", data: null }, { status: 400 });

    const buffer = Buffer.from(base64String.split(",")[1], 'base64');

    const outputPath = path.join(process.cwd(), '/public/uploads/', name);

    fs.writeFileSync(outputPath, buffer);

    try {
        // const res = await prisma.event_image.create({ data: { name, url: outputPath, eventId } });

        return NextResponse.json({ error: false, success: true, msg: "success", data: outputPath }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: true, success: false, msg: error.message, data: null }, { status: 400 });
    }
}

export async function PATCH(req: NextRequest) {
    const images: POST[] = await req.json();

    if (images.length)
        return NextResponse.json(
            { error: true, success: false, msg: "unsufficient parimeters", data: null }, { status: 400 }
        );

    try {
        images.map((image: POST) => () => {
            const buffer = Buffer.from(image.base64String.split(",")[1], 'base64');
            const outputPath = path.join(process.cwd(), '/public/uploads/', image.name);
            fs.writeFileSync(outputPath, buffer);
        });

        return NextResponse.json({ error: false, success: true, msg: "success", data: null }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: true, success: false, msg: error.message, data: null }, { status: 400 });
    }
}

