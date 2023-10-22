import { NextRequest, NextResponse } from "next/server";
import { POST } from "./types";
import prisma from "@/shared/prisma/db";
import { POST as coordinator } from './coordinator/types';
import { POST as image } from './image/types';

import path from "path";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs'


export async function GET() {

    try {
        const data = await prisma.event.findMany({ where: { isActive: true } })
        return NextResponse.json({ error: false, success: true, msg: "success", data }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: true, success: false, msg: error.message, data: null }, { status: 400 });
    }
}



export async function POST(req: NextRequest) {
    const { name, organizer, description, startDate, endDate, startTime, endTime, coordinators, images }: POST = await req.json();

    let coverImageURL = process.env.DUMMY_IMAGE_URL as string;

    if (!name || !organizer || !description || !startDate || !endDate || !startTime || !endTime)
        return NextResponse.json({ error: true, success: false, msg: "unsufficient parimeters", data: null }, { status: 400 });

    try {
        const data = await prisma.event.create({ data: { name, organizer, description, startDate, endDate, startTime, endTime, coverImageURL } });

        coordinators.map(async (coordiantor: coordinator) => {
            const { name, email, contNo, department, course, semister, type } = coordiantor;
            await prisma.event_coordinator.create({ data: { name, email, contNo, department, course, semister, type, eventId: data.id } });
        });

        images.map(async (image: image) => {
            await prisma.event_image.create({ data: { name: image.name, url: image.url, eventId: data.id } });
        })

        return NextResponse.json({ error: false, success: true, msg: "success", data }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ error: true, success: false, msg: error.message, data: null }, { status: 400 });
    }
}

