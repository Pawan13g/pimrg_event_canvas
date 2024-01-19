
// ORM CLIENT
import prisma from "@/shared/prisma/db";

// LIBS
import dayjs from "dayjs";
import fs from 'fs';
import archiver from 'archiver';
import path from "path";

// NEXTJS TYPES
import { NextRequest, NextResponse } from "next/server";
import { purifyString } from "@/shared/utils/utils";


export async function GET(req: NextRequest, { params: { eventId } }: { params: { eventId: string } }) {

    const event = await prisma.event.findUnique({ where: { id: parseInt(eventId) }, include: { images: true } })

    if (!event)
        return NextResponse.json(
            {
                error: true,
                success: false,
                data: null,
                msg: `no event found for eventID: ${eventId}`
            }, { status: 404 }
        );

    if (!event.images.length) {
        return NextResponse.json(
            {
                error: true,
                success: false,
                data: null,
                msg: `Event - ${event.name} has no images`
            }, { status: 404 }
        );
    }

    const zipName = `${purifyString(event.name)}_${dayjs(event.startDate).format('YYYYMMDDTHHmmss')}.zip`;
    const zipRelativePath = `uploads/images/archives/${zipName}`
    const outputPath = fs.createWriteStream(path.join(process.cwd(), 'public', zipRelativePath));

    const archive = archiver('zip', { zlib: { level: 9 }, });

    archive.on('error', (err) => {
        return NextResponse.json(
            {
                error: true,
                success: false,
                data: null,
                msg: err.message
            }, { status: 400 }
        );
    });

    archive.pipe(outputPath);

    event.images.forEach((image) => {
        archive.append(fs.createReadStream(`public/${image.url}`), { name: image.name });
    });

    archive.finalize();

    return NextResponse.json(
        {
            error: false,
            success: true,
            msg: 'zip has been zipped successfully',
            data: {
                zipName,
                url: `${process.env.NEXT_PUBLIC_UPLOAD_DIRECTORY}/${zipRelativePath}`
            }
        }, { status: 201 });

}

export async function DELETE(req: NextRequest, { params: { eventId } }: { params: { eventId: string } }) {

    const { name } = await req.json();

    try {

        const archivePath = `public/uploads/images/archives/${name}`

        if (!fs.existsSync(archivePath)) {
            return NextResponse.json(
                {
                    error: true,
                    success: false,
                    data: null,
                    msg: `${name} zip not found`
                }, { status: 404 }
            );
        }

        fs.rmSync(archivePath);

        return NextResponse.json(
            {
                error: false,
                success: true,
                msg: `${name} removed`,
                data: null
            }, { status: 200 });

    } catch (error: any) {

        return NextResponse.json(
            {
                error: true,
                success: false,
                data: null,
                msg: error.message
            }, { status: 400 }
        );
    }
}