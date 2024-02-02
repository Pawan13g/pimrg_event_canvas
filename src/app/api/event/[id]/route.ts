// ORM CLIENT 
import prisma from "@/shared/prisma/db";

// IO LIBS
import fs from 'fs'
import path from "path";

// TYPES
import { NextRequest, NextResponse } from "next/server";
import { PUT } from "../types";
import { POST as coordinator } from '../coordinator/types';
import { POST as image } from '../image/types';

export async function GET(req: Request, { params: { id } }: { params: { id: number } }) {

    if (!id)
        return NextResponse.json({ error: true, success: false, msg: "unsufficient parimeters", data: null }, { status: 400 });

    try {
        const data = await prisma.event.findUnique({ where: { id: Number(id) }, include: { coordinators: true, images: true, report: true, coverImage: true }, });
        if (!data) return NextResponse.json({ error: false, success: true, msg: "event not found", data }, { status: 404 });
        return NextResponse.json({ error: false, success: true, msg: "success", data }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: true, success: false, msg: error.message, data: null }, { status: 400 });
    }
}

export async function DELETE(req: Request, { params: { id } }: { params: { id: number } }) {

    if (!id)
        return NextResponse.json({ error: true, success: false, msg: "unsufficient parimeters", data: null }, { status: 400 });

    try {
        const event = await prisma.event.update({ where: { id: Number(id) }, data: { isActive: false } });

        return NextResponse.json({ error: false, success: true, msg: `Event - "${event.name}" Deleted `, data: null }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: true, success: false, msg: error.message, data: null }, { status: 400 });
    }
}

export async function PUT(req: Request, { params: { id } }: { params: { id: string } }) {

    try {
        const { name, organizer, description, startDate, endDate, startTime, endTime, coordinators, images, report, coverImage }: PUT = await req.json();


        if (!id) return NextResponse.json({ error: true, success: false, msg: "unsufficient parimeters", data: null }, { status: 400 });

        if (!name || !organizer || !description || !startDate || !endDate || !startTime || !endTime)
            return NextResponse.json({ error: true, success: false, msg: "unsufficient parimeters", data: null }, { status: 400 });

        const prevData = await prisma.event.findFirst({ where: { id: Number(id) }, include: { coordinators: true, images: true, report: true } });

        if (!prevData) return NextResponse.json({ error: true, success: false, msg: "event not found", data: null }, { status: 404 });

        const data = await prisma.event.update({ where: { id: Number(id) }, data: { name, organizer, description, startDate, endDate, startTime, endTime } });

        coordinators && coordinators.map(async (coordiantor: coordinator) => {
            const { name, email, contNo, department, batchStartDate, batchEndDate, type } = coordiantor;

            const isExist = await prisma.event_coordinator.findUnique({ where: { email } });

            // update exsiting one's
            if (isExist) await prisma.event_coordinator.update({ where: { id: isExist.id }, data: { name, email, contNo, department, type, eventId: data.id } });

            // if not exist, crate new one
            else await prisma.event_coordinator.create({ data: { name, email, contNo, department, batchStartDate, batchEndDate, type, eventId: parseInt(id) } });
        });

        // add new images if added
        images && images.map(async ({ url, name }: image) => {
            const imageBuffer = Buffer.from(url.split(",")[1], 'base64');
            const imageRelativePath = `uploads/images/${name}`
            const imageOutputPath = path.join(process.cwd(), 'public', imageRelativePath);
            fs.writeFileSync(imageOutputPath, imageBuffer);
            await prisma.event_image.create({ data: { name: name, url: imageRelativePath, eventId: parseInt(id) } });
        })

        // update cover image if exits
        if (coverImage && coverImage.name && coverImage.url) {
            const coverImageBuffer = Buffer.from(coverImage.url.split(",")[1], 'base64');
            const coverImageRelativePath = `uploads/images/${coverImage.name}`
            const coverImageOutputPath = path.join(process.cwd(), 'public', coverImageRelativePath);
            fs.writeFileSync(coverImageOutputPath, coverImageBuffer);
            await prisma.event_cover_image.update({ where: { eventId: parseInt(id) }, data: { url: coverImageRelativePath } });
        }

        // add new report if exits
        if (report && report.url && report.name) {
            const reportBuffer = Buffer.from(report.url.split(",")[1], 'base64');
            const reportRelativePath = `uploads/reports/${report.name}`
            const reportOutputPath = path.join(process.cwd(), 'public', reportRelativePath);
            fs.writeFileSync(reportOutputPath, reportBuffer);
            await prisma.event_report.update({ where: { eventId: parseInt(id) }, data: { url: reportRelativePath } });
        }

        return NextResponse.json({ error: false, success: true, msg: "event updated", data }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: true, success: false, msg: error.message, data: null }, { status: 400 });
    }
}
