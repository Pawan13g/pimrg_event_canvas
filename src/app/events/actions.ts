"use server";

import { EventType } from "@/shared/constants/types";
import prisma from "@/shared/prisma/db";
import { createImagesZipStream } from "@/shared/utils/name";
import archiver from "archiver";
import dayjs from "dayjs";
import fs from "fs";
import { redirect } from "next/navigation";

export const getAllEvents = async (searchParams: {
    [key: string]: string | undefined;
}) => {
    const { name, from, to } = searchParams;

    try {
        if (name) {
            const data = await prisma.event.findMany({
                where: { isActive: true, name: { contains: name } },
                include: { cover_image: true }
            });

            return {
                error: false,
                msg: data.length
                    ? `Events for name: ${name}`
                    : `No events found for name: ${name}`,
                data,
            };

        } else if (from || to) {

            if (!from || !to) {
                return {
                    error: true,
                    msg: "Both from and to date must be selected",
                    data: null,
                };
            }

            const data = await prisma.event.findMany({
                where: {
                    isActive: true,
                    startDate: { gte: new Date(from) },
                    endDate: { lte: new Date(to) },
                },
                include: { cover_image: true }
            });

            return {
                error: false,
                msg: data.length
                    ? `Events found b/w dates ${dayjs(from)} - ${dayjs(to)}`
                    : `No events found b/w dates ${dayjs(from)} - ${dayjs(to)}`,
                data,
            };

        } else {
            const data = await prisma.event.findMany({
                where: { isActive: true },
                include: { cover_image: true }
            });

            return {
                error: false,
                msg: data.length
                    ? `All events in the present in the records`
                    : `No events are present in the records`,
                data,
            };
        }
    } catch (error: any) {
        return {
            error: true,
            msg: "Internal Server Error",
            data: null,
        };
    }
};

export const getRecentEvents = async () => {
    const currentDate = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(currentDate.getMonth() - 6);

    try {
        const data = await prisma.event.findMany({ where: { isActive: true }, include: { cover_image: true } });
        return {
            error: false,
            msg: data.length
                ? `All events in the present in the records`
                : `No events are present in the records`,
            data,
        };
    } catch (error: any) {
        return {
            error: true,
            msg: "Internal Server Error",
            data: null,
        };
    }
};

export const getOneEvent = async (id: string) => {

    if (!id) return { error: true, msg: "Unsufficient parimeters", data: null }

    try {
        const data = await prisma.event.findUnique({ where: { id: parseInt(id) }, include: { coordinators: true, images: true, report: true, cover_image: true }, });

        if (!data) return { error: true, msg: `No event found for id: ${id}`, data: null }

        return { error: false, msg: `Event found for id: ${id}`, data }

    } catch (error) {
        return { error: true, msg: `Internal Server Error`, data: null }
    }

}

export const getEventImagesZipLink = async (formData: FormData) => {

    const id = formData.get("id")?.toString();

    if (!id) return

    const event = await prisma.event.findUnique({ where: { id: parseInt(id) }, include: { images: true } })

    if (!event)
        return {
            error: true,
            data: null,
            msg: `no event found for eventID: ${id}`
        };

    if (!event.images.length) {
        return {
            error: true,
            data: null,
            msg: `Event - ${event.name} has no images`
        }
    }

    const archive = archiver('zip', { zlib: { level: 9 }, });

    archive.on('error', (err) => {
        return {
            error: true,
            data: null,
            msg: err.message
        }
    });


    const { zipStream, zipRelativePath } = createImagesZipStream(event);

    archive.pipe(zipStream);

    event.images.forEach((image) => {
        archive.append(fs.createReadStream(`public/${image.url}`), { name: image.name });
    });

    archive.finalize();

    redirect(`${process.env.NEXT_PUBLIC_UPLOAD_DIRECTORY}/${zipRelativePath}`)
}
