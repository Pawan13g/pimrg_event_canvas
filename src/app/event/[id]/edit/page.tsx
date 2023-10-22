"use client"

import { Badge } from '@/shared/components/ui/badge';
import { Separator } from '@/shared/components/ui/separator';
import { EVENTS_API, EVENT_API } from '@/shared/constants/endpoint';
import { APIResponse, EventType } from '@/shared/constants/types';
import { event, event_coordinator, event_image } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import Image from 'next/image';
import React from 'react';
import { CgImage } from 'react-icons/cg'
import { HiOutlineDocumentReport } from 'react-icons/hi'
import { BiEditAlt } from 'react-icons/bi'

import EventForm from '@/shared/components/event-form/event-form';



export default function EditEventDetails({ props, params: { id } }: { props: any, params: { id: string } }) {

    const { data: event, isLoading, isError } = useQuery(['post', id], async () => {
        try {
            const response: AxiosResponse<APIResponse<EventType>> = await axios.get(EVENT_API.replace(':id', id));
            return response.data.data;
        } catch (error: any) {
            new Error(error.message)
        }
    });

    return (
        event
            ? <EventForm event={event} />
            : <span> Loading</span>
    )
}