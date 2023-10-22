// ORM CLIENT 
import prisma from "@/shared/prisma/db";

// TYPES
import { PUT } from "../types";
import { POST as coordinator } from '../coordinator/types';
import { POST as image } from '../image/types';
import { NextResponse } from "next/server";


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

export async function GET(req: Request, { params: { id } }: { params: { id: string } }) {

    if (!id)
        return NextResponse.json({ error: true, success: false, msg: "unsufficient parimeters", data: null }, { status: 400 });

    try {
        const data = await prisma.event.findFirst({ where: { name: id }, include: { coordinators: true, images: true } });

        return NextResponse.json({ error: false, success: true, msg: "success", data }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: true, success: false, msg: error.message, data: null }, { status: 400 });
    }

}

export async function PUT(req: Request, { params: { id } }: { params: { id: number } }) {

    try {
        const { name, organizer, description, startDate, endDate, startTime, endTime, coordinators, images }: PUT = await req.json();

        if (!id)
            return NextResponse.json({ error: true, success: false, msg: "unsufficient parimeters", data: null }, { status: 400 });

        if (!name || !organizer || !description || !startDate || !endDate || !startTime || !endTime)
            return NextResponse.json({ error: true, success: false, msg: "unsufficient parimeters", data: null }, { status: 400 });

        const data = await prisma.event.update({ where: { id: Number(id) }, data: { name, organizer, description, startDate, endDate, startTime, endTime } });

        coordinators && coordinators.map(async (coordiantor: coordinator) => {
            const { name, email, contNo, department, course, semister, type } = coordiantor;

            const isExist = await prisma.event_coordinator.findUnique({ where: { email } });

            // update exsiting one's
            if (isExist) await prisma.event_coordinator.update({ where: { id: isExist.id }, data: { name, email, contNo, department, course, semister, type, eventId: data.id } });

            // if not exist, crate new one
            else await prisma.event_coordinator.create({ data: { name, email, contNo, department, course, semister, type, eventId: id } });
        });

        images && images.map(async (image: image) => {
            await prisma.event_image.create({ data: { name: image.name, url: image.url, eventId: id } });
        })

        return NextResponse.json({ error: false, success: true, msg: "event updated", data }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: true, success: false, msg: error.message, data: null }, { status: 400 });
    }
}
