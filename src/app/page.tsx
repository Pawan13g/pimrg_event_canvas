import Image from 'next/image'
import { Button } from "@/shared/components/ui/button"
import { Separator } from "@/shared/components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs"

import { AiOutlinePlusCircle } from "react-icons/ai"
import axios, { AxiosResponse } from 'axios'
import { EVENTS_API, RECENT_EVENTS_API } from '@/shared/constants/endpoint'
import { event } from '@prisma/client'
import Link from 'next/link'
import { responseType } from '@/shared/constants/types'

const getEvents = async (eventsType: string | undefined = undefined) => {

  try {
    const endPoint = eventsType === "all" ? EVENTS_API : RECENT_EVENTS_API
    const response: AxiosResponse<responseType<event[]>> = await axios.get(endPoint);
    return response.data.data;
  } catch (error) {
    console.log(error)
    return [];
  }

}


export default async function Home({ searchParams: { eventsType } }: { searchParams: { [key: string]: string | undefined } }) {

  const events: any = await getEvents(eventsType);

  return (
    <>
      <div className="hidden md:block w-full">
        <div className="col-span-3 lg:col-span-4">
          <div className="h-full py-6">
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
                <div className="grid grid-cols-4">
                  {events.map((event: event, index: number) => (
                    <div key={index} className="space-y-3 w-[250px]">
                      <div className="overflow-hidden rounded-md">
                        <Image
                          src={event.coverImageURL as string}
                          alt={"Event Image"}
                          width={250}
                          height={330}
                          className="h-auto w-auto object-cover transition-all hover:scale-105"
                        />
                      </div>
                      <div className="space-y-1 ml-2 text-sm">
                        <h3 className="font-medium leading-none">{event.name}</h3>
                        <p className="text-xs text-muted-foreground">{event.organizedBY}</p>
                      </div>
                    </div>
                  ))}
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
                      All event hosed by us till now
                    </p>
                  </div>
                </div>
                <Separator className="my-4" />
                <div>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Obcaecati, velit ratione maxime corporis sunt voluptatibus. Modi maiores ullam, nobis voluptatum dicta, distinctio doloribus quos dignissimos necessitatibus dolorum neque, quasi velit.</div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  )
}
