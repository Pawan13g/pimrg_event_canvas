import { NextResponse } from "next/server";
import prisma from "@/shared/prisma/db";



export async function GET() {
    
    const currentDate = new Date();
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(currentDate.getMonth() - 6);

    try {
        const data = await prisma.event.findMany({ where: { isActive: true } })
        return NextResponse.json({ error: false, success: true, msg: "success", data }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ error: true, success: false, msg: error.message, data: null }, { status: 400 });
    }
}
