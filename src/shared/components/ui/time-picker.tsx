"use client"
import {
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/components/ui/popover"

import { ScrollArea } from "@/shared/components/ui/scroll-area"

import React, { useState } from 'react'
import { Separator } from "./separator";
import { Button } from "./button";
import dayjs from "dayjs";
import { cn, formatTime } from "@/shared/utils/utils";
import { ClockIcon } from "lucide-react";
import { parseISO } from "date-fns";

type Props = {
    field: any;
}


const TimePicker = (props: Props) => {
    const { field } = props;
    const [time, setTime] = useState({ hours: 0, minutes: 0, period: 'AM' });

    const updateTime = (property: string, value: number) => {
        setTime((prev) => ({ ...prev, [property]: value }));
    };

    const handleTimeClick = (property: string, value: any) => {
        updateTime(property, value);
    };


    const handleOkClick = () => {
        const date = dayjs().set('hour', time.hours).set('minute', time.minutes);

        // If the period is PM and the hour is not 12, add 12 to the hour
        if (time.period === "PM" && time.hours !== 12) {
            date.add(12, 'hour');
        }

        field.onChange(date.toDate());
    };

    return (
        <Popover>
            <PopoverTrigger className="w-full" asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full pl-3 text-left font-normal hover:border-gray-400 focus:border-gray-400",
                        !field.value && "text-muted-foreground"
                    )}
                >
                    {field.value ? (
                        formatTime(field.value)
                    ) : (
                        <span>Select the time</span>
                    )}
                    <ClockIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="p-0 cursor-default">

                <div className="flex flex-col">
                    <div className="flex p-2">
                        <ScrollArea className="h-64" >
                            <div className="mr-1">
                                <div className="flex flex-col text-center pr-2">
                                    {Array.from(Array(12).keys()).map((number) => (
                                        <span
                                            key={number}
                                            className={cn(
                                                "hover:bg-secondary px-2 py-1 rounded-sm transition-all"
                                            )}
                                            onClick={() => handleTimeClick('hours', number + 1)}
                                        >
                                            {`${number + 1}`.padStart(2, '0')}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </ScrollArea>

                        <Separator orientation="vertical" className=" mx-2 w-[0.5px] bg-input h-64 rounded-full" />

                        <ScrollArea className="h-64" >
                            <div className="mr-1">
                                <div className="flex flex-col text-center pr-2">
                                    {Array.from(Array(60).keys()).map((number) => (
                                        <span
                                            key={number}
                                            className="hover:bg-secondary px-2 py-1 rounded-sm transition-all"
                                            onClick={() => handleTimeClick('minutes', number + 1)}
                                        >
                                            {`${number + 1}`.padStart(2, '0')}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </ScrollArea>

                        <Separator orientation="vertical" className="mx-2 w-[1px] bg-input h-64 rounded-full" />

                        <div className="flex flex-col text-center">
                            {['AM', 'PM'].map((period) => (
                                <span
                                    key={period}
                                    className="hover:bg-secondary px-2 py-1 rounded-sm transition-all"
                                    onClick={() => handleTimeClick('period', period)}
                                >
                                    {period}
                                </span>
                            ))}
                        </div>

                    </div>

                    <Separator orientation="horizontal" className="h-[0.5px] bg-input rounded-full" />

                    <div className="px-2 py-2 flex justify-between">
                        <PopoverClose>
                            <Button className="h-[initial] py-1 " variant="outline" size="sm">Close</Button>
                        </PopoverClose>

                        <PopoverClose>
                            <Button className="h-[initial] py-1 " variant="default" size="sm" onClick={handleOkClick}>Ok</Button>
                        </PopoverClose>
                    </div>
                </div>


            </PopoverContent>
        </Popover>
    )
}

export default TimePicker