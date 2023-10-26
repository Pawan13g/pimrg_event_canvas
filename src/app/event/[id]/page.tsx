import { Badge } from '@/shared/components/ui/badge';
import { Separator } from '@/shared/components/ui/separator';
import { EVENTS_API, EVENT_API } from '@/shared/constants/endpoint';
import { APIResponse, EventType } from '@/shared/constants/types';
import { event, event_coordinator, event_image } from '@prisma/client';
import axios, { AxiosResponse } from 'axios';
import Image from 'next/image';
import React from 'react';
import { CgImage } from 'react-icons/cg'
import { HiOutlineDocumentReport } from 'react-icons/hi'
import { BiEditAlt } from 'react-icons/bi'

// import { ChevronDownIcon } from "@radix-ui/react-icon"

import { Button } from "@/shared/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card"
import Link from 'next/link';


const fetchEvent = async (id: string) => {

    try {
        const response: AxiosResponse<APIResponse<EventType>> = await axios.get(`${EVENTS_API}?id=${id}`);
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.message)
    }
};



export default async function EventPage({ params, searchParams: { id }, }: { params: { id: string }, searchParams: { [key: string]: string } }) {

    const event = await fetchEvent(id);

    const studentCoordinator = event?.coordinators.filter((coordinator: event_coordinator) => coordinator.type === 'STUDENT');
    const facultyCoordinator = event?.coordinators.filter((coordinator: event_coordinator) => coordinator.type === 'FACULTY');


    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium flex gap-2 items-center">
                    {event?.name.toUpperCase()}
                    <Link href={`${params.id}/edit?id=${id}`}><BiEditAlt className="hover:scale-125 transition-all hover:text-purple-500" /></Link>
                </h3>
                <p className="text-sm text-muted-foreground">
                    {event?.description}
                </p>
            </div>

            <Separator />

            <div className='grid grid-cols-10'>

                <div className='col-span-7 space-y-4'>
                    <h1 className=' font-semibold'>EVENT IMAGES</h1>

                    <div className='overflow-auto mr-4'>
                        <div className='grid grid-cols-3 gap-8'>
                            {event?.images.map((image: event_image, index: number) => (
                                <div key={index} className="space-y-3 overflow-hidden rounded-md  border">
                                    <Image
                                        src={`${process.env.NEXT_UPLOAD_DIRECTORY}/${image.url}`}
                                        alt={"Event Image"}
                                        unoptimized={true}
                                        width={250}
                                        height={330}
                                        className="h-auto w-auto object-cover aspect-video"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>


                <div className='flex col-span-3'>
                    <Separator orientation='vertical' className='mr-4' />

                    <div className='space-y-4'>

                        <Link href={`${id}/images-download`} target='_blank' className='inline-flex items-center cursor-default justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 rounded-md px-3 w-full border'>
                            <CgImage className="text-lg mr-2" />
                            Download Images
                        </Link>

                        <a className='w-full inline-flex items-center justify-center text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3' href={`${process.env.NEXT_UPLOAD_DIRECTORY}/${event.report.url}`} download={true}>
                            <HiOutlineDocumentReport className="text-lg mr-2" />
                            Download Report
                        </a>

                        <Card className='w-full'>
                            <CardHeader className='p-4'>
                                <CardTitle className='text-base'>COORDINATORS</CardTitle>
                                <CardDescription>
                                    All coordinators of the event
                                </CardDescription>
                            </CardHeader>
                            <CardContent className='px-4'>
                                <Separator className="mb-4" />
                                <div className="space-y-3">
                                    <h4 className="text-sm text-gray-600 font-medium">FACULTY COORDINATORS</h4>
                                    <div className='flex flex-wrap gap-2'>
                                        {facultyCoordinator?.map((coordinator: event_coordinator, index) => (
                                            <Badge key={index} className='text-[10px]' color='gold'>{coordinator.name}</Badge>
                                        ))}
                                    </div>
                                </div>

                                <Separator className="my-4" />

                                <div className="space-y-3">
                                    <h4 className="text-sm text-gray-600 font-medium">STUDENT COORDINATORS</h4>
                                    <div className='flex flex-wrap gap-2'>
                                        {studentCoordinator?.map((coordinator: event_coordinator, index) => (
                                            <Badge key={index} className='text-[10px]' color='red'>{coordinator.name}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>



                </div>
            </div>


        </div>
    )
}