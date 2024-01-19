
import { NextResponse } from "next/server";
import prisma from "@/shared/prisma/db";
import { POST } from "../types";


export async function GET(request: Request, { params: { id } }: { params: { id: number } }) {
    if (!id)
        return NextResponse.json({ error: true, success: false, msg: "unsufficient parimeters", data: null }, { status: 400 });

    try {
        const data = await prisma.event_coordinator.findUnique({ where: { id: Number(id), isActive: true } });

        if (!data)
            return NextResponse.json({ error: true, success: false, msg: `no coordianator found for id: ${id}`, data: null }, { status: 400 });

        return NextResponse.json({ error: false, success: true, msg: "success", data }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: true, success: false, msg: error.message, data: null }, { status: 400 });
    }
}

export async function PUT(req: Request, { params: { id } }: { params: { id: number } }) {

    const body: POST = await req.json();

    if (!id)
        return NextResponse.json({ error: true, success: false, msg: "unsufficient parimeters", data: null }, { status: 400 });

    try {
        const data = await prisma.event_coordinator.update({ where: { id: Number(id), isActive: true }, data: { ...body } });

        return NextResponse.json({ error: false, success: true, msg: "success", data }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: true, success: false, msg: error.message, data: null }, { status: 400 });
    }
}

export async function DELETE(req: Request, { params: { id } }: { params: { id: number } }) {

    if (!id)
        return NextResponse.json({ error: true, success: false, msg: "unsufficient parimeters", data: null }, { status: 400 });

    try {
        const data = await prisma.event_coordinator.update({ where: { id: Number(id) }, data: { isActive: false } });
        return NextResponse.json({ error: false, success: true, msg: "success", data: data }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: true, success: false, msg: error.message, data: null }, { status: 400 });
    }
}
