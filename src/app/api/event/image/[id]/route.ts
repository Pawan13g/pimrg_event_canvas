
import { NextResponse } from "next/server";
import prisma from "@/shared/prisma/db";



export async function DELETE(req: Request, { params: { id } }: { params: { id: number } }) {

    if (!id)
        return NextResponse.json({ error: true, success: false, msg: "unsufficient parimeters", data: null }, { status: 400 });

    try {
        const event = await prisma.event_image.update({ where: { id: Number(id) }, data: { isActive: false } });

        return NextResponse.json({ error: false, success: true, msg: "success", data: { event } }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: true, success: false, msg: error.message, data: null }, { status: 400 });
    }
}
