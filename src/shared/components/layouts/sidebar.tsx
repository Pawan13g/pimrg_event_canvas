import React from 'react'

import { Button } from "@/shared/components/ui/button"
import { cn } from '@/shared/utils/utils'
import { BsFillCalendar3EventFill } from "react-icons/bs"

type Props = React.HTMLAttributes<HTMLDivElement> & {

}

const SideBar = ({ className }: Props) => {
    return (
        <div className={cn("min-w-[15rem] max-w-[15rem] border-r pb-12", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2 space-y-1">
                    <Button variant="secondary" className="w-full justify-start">
                        <BsFillCalendar3EventFill className="mr-4 text-lg" />
                        Events
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default SideBar