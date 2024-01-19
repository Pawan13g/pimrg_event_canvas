// REACT CORE
import React from 'react'

// UI COMPONENTS

import { Avatar, AvatarFallback, AvatarImage, } from "@/shared/components/ui/avatar"

import { Button } from '../ui/button'

import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/shared/components/ui/hover-card";

// ICONS

import { AiFillMail } from 'react-icons/ai';
import Link from 'next/link';


const DevProfile = () => {
    return (
        <>
            <HoverCard>
                <HoverCardTrigger asChild>
                    <Button variant="ghost" className="fixed bottom-4 right-4 h-8 w-8 rounded-full z-10">
                        <Avatar className="h-10 w-10 border bg-slate-400 hover:bg-slate-100">
                            <AvatarFallback>PG</AvatarFallback>
                        </Avatar>
                    </Button>
                </HoverCardTrigger>

                <HoverCardContent sideOffset={10} className="w-80 space-y-2">
                    <Avatar>
                        <AvatarImage className='aspect-square' src="../owner.JPG" alt="Pawan Gupta" />
                        <AvatarFallback>PG</AvatarFallback>
                    </Avatar>

                    <div className="space-y-1">

                        <div className='space-y-1'>
                            <h4 className="text-sm font-semibold">Pawan Gupta</h4>
                            <div className='flex items-center'>
                                <AiFillMail className="text-sm mr-1" />
                                <Link className='text-xs hover:text-purple-500 hover:underline' href="mailto:devloper.evox@gmail.com">devloper.evox@gmail.com</Link>
                            </div>
                        </div>

                        <span className="text-xs text-muted-foreground">
                            <span className='text-red-500'>PIMRG</span>
                            {` | BCA (2021-2024)`}
                        </span>
                        <p className="text-xs">
                            This Web application is developed by me.
                        </p>
                    </div>
                </HoverCardContent>
            </HoverCard>
        </>
    )
}

export default DevProfile