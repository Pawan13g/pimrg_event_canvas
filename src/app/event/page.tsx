// LIBS
import axios, { AxiosResponse } from 'axios'

// UI COMPONENTS
import Image from 'next/image'
import Link from 'next/link'

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/shared/components/ui/tabs"

import { Button } from "@/shared/components/ui/button"

import { Separator } from "@/shared/components/ui/separator"

// ICONS
import { AiOutlinePlusCircle } from "react-icons/ai"
import { SlEvent } from "react-icons/sl"

// API ENDPOINTS
import { EVENTS_API, RECENT_EVENTS_API } from '@/shared/constants/endpoint'

// TYPES
import { event } from '@prisma/client'
import { APIResponse, EventType } from '@/shared/constants/types'
import { Input } from '@/shared/components/ui/input'

const getEvents = async (eventsType: string | undefined = undefined) => {

    try {
        const endPoint = eventsType === "all" ? EVENTS_API : RECENT_EVENTS_API
        const response: AxiosResponse<APIResponse<EventType[]>> = await axios.get(endPoint);
        return response.data.data;
    } catch (error: any) {
        throw new Error(error.message);
    }
}


export default async function Home({ searchParams: { eventsType } }: { searchParams: { [key: string]: string | undefined } }) {

    const events: EventType[] = await getEvents(eventsType);

    return (
        <div className="hidden md:block w-full">
            <div className="col-span-3 lg:col-span-4">
                <div className="h-full">
                    <Tabs defaultValue="music" className="h-full space-y-6">
                        <div className="space-between flex items-center">
                            <TabsList>
                                <Link href="/">
                                    <TabsTrigger value="music" className="relative">
                                        Recent
                                    </TabsTrigger>
                                </Link>
                                <Link href="?eventsType=all">
                                    <TabsTrigger value="podcasts">
                                        All
                                    </TabsTrigger>
                                </Link>
                            </TabsList>
                            <div className="ml-auto mr-4">
                                <Link href="/event/create">
                                    <Button >
                                        <AiOutlinePlusCircle className="mr-2 h-4 w-4" />
                                        Add Event
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <TabsContent
                            value="music"
                            className="border-none p-0 outline-none"
                        >
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-semibold tracking-tight">
                                        RECENT EVENTS
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Checkout our recent events in our campus.
                                    </p>
                                </div>

                            </div>
                            <Separator className="my-4" />
                            <div className="grid grid-cols-4 gap-4">
                                {events.length ? events.map((event: event, index: number) => (
                                    <Link key={index} href={`event/${event.name}?id=${event.id}`}>
                                        <div className="space-y-3">
                                            <div className="overflow-hidden rounded-md border">
                                                <Image
                                                    src={`${process.env.NEXT_UPLOAD_DIRECTORY}/${event.coverImageURL}`}
                                                    alt={"Event Image"}
                                                    unoptimized={true}
                                                    width={250}
                                                    height={330}
                                                    className="h-auto w-auto object-cover transition-all hover:scale-105 aspect-video"
                                                />
                                            </div>
                                            <div className="space-y-1 ml-2 text-sm">
                                                <h3 className="font-medium leading-none">{event.name}</h3>
                                                <p className="text-xs text-muted-foreground">{event.organizer}</p>
                                            </div>
                                        </div>
                                    </Link>
                                )) : (
                                    <div className='flex justify-center items-center border gap-4 rounded-md w-full col-span-4 flex-col p-4 h-[300px]'>
                                        <SlEvent className="text-6xl" />
                                        <span>No events found</span>
                                    </div>)
                                }
                            </div>
                        </TabsContent>
                        <TabsContent
                            value="podcasts"
                            className="h-full flex-col border-none p-0 data-[state=active]:flex"
                        >
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-semibold tracking-tight">
                                        ALL EVENTS
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        All event hosted in campus till now
                                    </p>
                                </div>
                            </div>
                            <Separator className="my-4" />
                            <div className="grid grid-cols-4 gap-4">
                                {events.length ? events.map((event: event, index: number) => (
                                    <Link key={index} href={`event/${event.name}?id=${event.id}`}>
                                        <div className="space-y-3">
                                            <div className="overflow-hidden rounded-md border">
                                                <Image
                                                    src={`${process.env.NEXT_UPLOAD_DIRECTORY}/${event.coverImageURL}`}
                                                    alt={"Event Image"}
                                                    unoptimized={true}
                                                    width={250}
                                                    height={330}
                                                    className="h-auto w-auto object-cover transition-all hover:scale-105 aspect-video"
                                                />
                                            </div>
                                            <div className="space-y-1 ml-2 text-sm">
                                                <h3 className="font-medium leading-none">{event.name}</h3>
                                                <p className="text-xs text-muted-foreground">{event.organizer}</p>
                                            </div>
                                        </div>
                                    </Link>
                                )) : (
                                    <div className='flex justify-center items-center border gap-4 rounded-md w-full col-span-4 flex-col p-4 h-[300px]'>
                                        <SlEvent className="text-6xl" />
                                        <span>No events found</span>
                                    </div>)
                                }
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
