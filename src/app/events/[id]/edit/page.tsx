"use client";

// NEXTJS CORE
import { redirect } from "next/navigation";

// HOOKS
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

//LIBS
import axios, { AxiosResponse } from "axios";

// COMPONENTS
import Spinner from "@/shared/components/ui/spin";
import EventForm from "@/shared/components/event-form/event-form";

// ENDPOINTS
import { EVENTS_API } from "@/shared/constants/endpoint";

// TYPES
import { APIResponse, EventType } from "@/shared/constants/types";
import { IAppState } from "@/shared/rdx/store";

export default function EditEventDetails({
  params: { id },
}: {
  params: { id: string };
}) {
  const user = useSelector((state: IAppState) => state.session.user);

  const {
    data: event,
    isLoading,
    isError,
  } = useQuery(["post", id], async () => {
    try {
      const response: AxiosResponse<APIResponse<EventType>> = await axios.get(
        `${EVENTS_API}/${id}`
      );
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  });

  // useEffect(() => {
  //   if (!user) redirect("/login");
  // }, [user]);

  useEffect(() => {
    if (isError) throw new Error();
  }, [isError]);

  return isLoading ? <Spinner /> : <EventForm event={event} />;
}
