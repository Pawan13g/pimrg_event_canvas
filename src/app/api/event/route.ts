// DB ORM CLIENT
import prisma from "@/shared/prisma/db";

// IO LIBS
import path from "path";
import fs from 'fs'

// TYPES
import { NextRequest, NextResponse } from "next/server";
import { POST } from "./types";
import { POST as coordinator } from './coordinator/types';
import { POST as image } from './image/types';

export async function GET(req: NextRequest) {

    const url = new URL(req.url);

    const name = url.searchParams.get('name');
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');

    try {
        if (name) {
            const data = await prisma.event.findMany({ where: { isActive: true, name: { contains: name } } })
            return NextResponse.json({ error: false, success: true, msg: "success ok", data }, { status: 200 });

        } else if (from || to) {

            if (!from || !to) {
                return NextResponse.json({ error: true, success: false, msg: "unsufficient search parameters", data: null }, { status: 400 });
            }

            const data = await prisma.event.findMany({ where: { isActive: true, startDate: { gte: new Date(from) }, endDate: { lte: new Date(to) } } })
            return NextResponse.json({ error: false, success: true, msg: "success", data }, { status: 200 });

        } else {
            const data = await prisma.event.findMany({ where: { isActive: true } })
            return NextResponse.json({ error: false, success: true, msg: "success", data }, { status: 200 });
        }

    } catch (error: any) {
        return NextResponse.json({ error: true, success: false, msg: error.message, data: null }, { status: 400 });
    }
}


export async function POST(req: NextRequest) {
    const { name, organizer, description, startDate, endDate, startTime, endTime, coordinators, images, report, coverImage }: POST = await req.json();

    if (!name || !organizer || !description || !startDate || !endDate || !startTime || !endTime)
        return NextResponse.json({ error: true, success: false, msg: "unsufficient parimeters", data: null }, { status: 400 });

    try {
        const data = await prisma.event.create({ data: { name, organizer, description, startDate, endDate, startTime, endTime } });

        coordinators.map(async (coordiantor: coordinator) => {
            const { name, email, contNo, department, batchEndDate, batchStartDate, type } = coordiantor;
            await prisma.event_coordinator.create({ data: { name, email, contNo, department, batchEndDate, batchStartDate, type, eventId: data.id } });
        });

        // upload event images to images directory
        images.map(async ({ url, name }: image) => {
            const buffer = Buffer.from(url.split(",")[1], 'base64');
            const imageRelativePath = `uploads/images/${name}`
            const outputPath = path.join(process.cwd(), 'public', imageRelativePath);
            fs.writeFileSync(outputPath, buffer);
            await prisma.event_image.create({ data: { name: name, url: imageRelativePath, eventId: data.id } });
        })

        // upload event coverimage to images directory
        const coverImageBuffer = Buffer.from(coverImage.url.split(",")[1], 'base64');
        const coverImageRelativePath = `uploads/images/${coverImage.name}`
        const coverImageOutputPath = path.join(process.cwd(), 'public', coverImageRelativePath);
        fs.writeFileSync(coverImageOutputPath, coverImageBuffer);
        await prisma.event_cover_image.create({ data: { name: coverImage.name, url: coverImageRelativePath, eventId: data.id } });

        // upload event report to report directory
        const reportBuffer = Buffer.from(report.url.split(",")[1], 'base64');
        const reportRelativePath = `uploads/reports/${report.name}`
        const reportOutputPath = path.join(process.cwd(), 'public', reportRelativePath);
        fs.writeFileSync(reportOutputPath, reportBuffer);
        await prisma.event_report.create({ data: { name: name, url: reportRelativePath, eventId: data.id } });

        return NextResponse.json({ error: false, success: true, msg: "success", data }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ error: true, success: false, msg: error.message, data: null }, { status: 400 });
    }
}

