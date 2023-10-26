"use client"

// HOOKS
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

//LIBS
import axios, { AxiosResponse } from 'axios';

// COMPONENTS
import EventForm from '@/shared/components/event-form/event-form';

// ENDPOINTS
import { EVENTS_API } from '@/shared/constants/endpoint';

// TYPES
import { APIResponse, EventType } from '@/shared/constants/types';



export default function EditEventDetails({ params, searchParams: { id }, }: { params: { id: string }, searchParams: { [key: string]: string } }) {

    const { data: event, isLoading, isError } = useQuery(['post', id], async () => {
        try {
            const response: AxiosResponse<APIResponse<EventType>> = await axios.get(`${EVENTS_API}?id=${id}`);
            return response.data.data;
        } catch (error: any) {
            throw new Error(error.message)
        }
    });

    useEffect(() => {
        if (isError)
            throw new Error();
    }, [isError])

    return (
        event
            ? <EventForm event={event} />
            : <span> Loading</span>
    )
}