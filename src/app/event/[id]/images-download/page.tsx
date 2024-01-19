"use client";

// HOOKS
import React, { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";

// LIBS
import axios, { AxiosResponse } from "axios";

// API ENDPOINTS
import { IMAGES_ZIP_API } from "@/shared/constants/endpoint";

// TYPES
import { APIResponse } from "@/shared/constants/types";

// ACTION FUNCTIONS
async function getImagesZip(id: string) {
  try {
    const response: AxiosResponse<
      APIResponse<{ url: string; zipName: string }>
    > = await axios.get(IMAGES_ZIP_API.replace(":id", id));
    return response.data.data;
  } catch (error: any) {
    throw new Error(error);
  }
}

const ImageDownload = ({ params: { id } }: { params: { id: string } }) => {
  const { data, isError, mutate } = useMutation(getImagesZip);

  useEffect(() => {
    mutate(id);
  }, [id]);

  useEffect(() => {
    if (data) {
      window.open(data.url);
      // window.close();
    }
  }, [data]);

  useEffect(() => {
    if (isError) throw new Error();
  }, [isError]);

  return (
    <div className="absolute top-0 left-0 bg-white h-screen w-screen flex justify-center items-center z-50">
      <div className="w-12 h-12 rounded-full absoluteborder-8 border-solid border-gray-200"></div>
      <div className="w-12 h-12 rounded-full animate-spin absolute border-8 border-solid border-purple-500 border-t-transparent"></div>
    </div>
  );
};

export default ImageDownload;
