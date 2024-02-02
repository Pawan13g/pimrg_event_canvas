// REQUIRED LIBERARIES
import axios from "axios";
import dayjs from "dayjs";

// HOOKS
import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

// ENDPOINTS
import { EVENTS_API, EVENT_API } from "@/shared/constants/endpoint";

// FORM UTILITIES
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// UI COMPONENTS
import Image from "next/image";

import { Button } from "@/shared/components/ui/button";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/shared/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";

import { Input } from "@/shared/components/ui/input";

import { Upload } from "@/shared/components/ui/upload";

import { Textarea } from "@/shared/components/ui/textarea";

import { Separator } from "@/shared/components/ui/separator";

import TimePicker from "@/shared/components/ui/time-picker";

import DatePicker from "@/shared/components/ui/date-picker";

// ICONS
import { AiOutlinePlusCircle } from "react-icons/ai";
import { PiImageSquareThin, PiImagesSquareThin } from "react-icons/pi";
import { HiOutlineDocumentReport } from "react-icons/hi";

// UTILS FUNCTIONS
import { convertFilesToBase64Array } from "@/shared/utils/utils";

// TYPES
import { EventType } from "@/shared/constants/types";
import { EventFormSchema, EventFormValues } from "./form.schema";
import { ArrowLeft } from "lucide-react";
import { revalidatePath, revalidateTag } from "next/cache";
import { TagRevalidator } from "./cache_revalidator";
import { event_coordinator } from "@prisma/client";
import { ScrollArea } from "../ui/scroll-area";

function useHandleSubmit(event?: EventType) {
  const createEvent = async (data: any) => {
    await axios.post(EVENTS_API, data.body);
  };

  const updateEvent = async (payload: any) => {
    const {
      body,
      params: { id },
    } = payload;
    await axios.put(EVENT_API.replace(":id", id), body);
  };

  return useMutation(event ? updateEvent : createEvent);
}

type props = {
  event?: EventType;
};

export default function EventForm(props: props) {
  const { event } = props;
  const router = useRouter();

  const { mutate, isLoading, isSuccess } = useHandleSubmit(event);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(EventFormSchema),
    mode: "onChange",
    defaultValues: {
      name: event?.name,
      description: event?.description,
      startDate: dayjs(event?.startDate).toDate(),
      endDate: dayjs(event?.endDate).toDate(),
      startTime: dayjs(event?.startTime).toDate(),
      endTime: dayjs(event?.endTime).toDate(),
      organizer: event?.organizer,
      // @ts-ignore // --> type error needs to be fixed
      coordinators: event?.coordinators.map((c: event_coordinator) => ({
        name: c.name,
        email: c.email,
        contNo: c.contNo,
        type: c.type,
        department: c.department ? c.department : undefined,
        batchStartDate: c.batchStartDate,
        batchEndDate: c.batchStartDate,
      })),
    },
  });

  const { fields, append } = useFieldArray({
    name: "coordinators",
    control: form.control,
  });

  const { images, coverImage, report } = form.watch();

  const facultyFields = useMemo(
    () => fields.filter((field) => field.type === "FACULTY"),
    [fields]
  );
  const studentFields = useMemo(
    () => fields.filter((field) => field.type === "STUDENT"),
    [fields]
  );

  useEffect(() => {
    if (isSuccess) TagRevalidator(), router.push("/events");
  }, [router, isSuccess]);

  useEffect(() => {
    if (event) {
      if (event.images.length) form.setValue("images", event.images);
      if (event.cover_image) form.setValue("coverImage", event.cover_image);
    }
  }, [event]);

  return (
    <div className="space-y-6 w-full">
      <div>
        <div className="flex items-center gap-2">
          <ArrowLeft
            size={20}
            className="hover:scale-125 transition-all hover:text-purple-500"
            onClick={() => router.back()}
          />
          <h3 className="text-lg font-medium">
            {event ? "UPDATE EVENT" : "CREATE EVENT"}
          </h3>
        </div>
        <p className="ml-7 text-sm text-muted-foreground">
          {event ? "Update existing event info" : "Create a new event"}
        </p>
      </div>

      <Separator />

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(async (data) => {
            mutate({ body: data, params: { id: event?.id } });
          })}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NAME</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter name"
                    name={field.name}
                    defaultValue={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                </FormControl>
                <FormDescription>
                  This will the name of the event which will be displayed
                  everywhere
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>DESCRIPTION</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Enter the short details or description of the event
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="organizer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ORGANISER</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Event Organizer" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>CLUBS</SelectLabel>
                      <SelectItem value="CSCLUB">CS CLUB</SelectItem>
                      <SelectItem value="FINANCECLUB">FINANCE CLUB</SelectItem>
                      <SelectItem value="HRCLUB">HR CLUB</SelectItem>
                      <SelectItem value="MARKETINGCLUB">
                        MARKETING CLUB
                      </SelectItem>
                    </SelectGroup>

                    <SelectGroup>
                      <SelectLabel>FEST</SelectLabel>
                      <SelectItem value="SPANDHAN">SPANDHAN</SelectItem>
                    </SelectGroup>

                    <SelectGroup>
                      <SelectLabel>OTHERS</SelectLabel>
                      <SelectItem value="OTHER">OTHER</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormDescription>
                  By whom the event is organiazed
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-4 gap-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>START DATE</FormLabel>

                  <FormControl>
                    <DatePicker field={field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>END DATE</FormLabel>

                  <FormControl>
                    <DatePicker field={field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>START TIME</FormLabel>

                  <FormControl>
                    <TimePicker field={field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>END TIME</FormLabel>

                  <FormControl>
                    <TimePicker field={field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator className="h-[0.5px]" />

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium leading-none">
                FACULTY COORDINATORS
              </span>
              <Button
                type="button"
                variant="default"
                size="default"
                onClick={() =>
                  append({
                    name: "",
                    contNo: "",
                    email: "",
                    type: "FACULTY",
                    department: "IT",
                  })
                }
              >
                <AiOutlinePlusCircle className="mr-2 h-4 w-4" />
                Add New
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Contact No</TableHead>
                  <TableHead>Department</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {facultyFields.length ? (
                  facultyFields.map((field, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <FormField
                          //@ts-ignore
                          name={`coordinators[${fields.findIndex(
                            (e) => e.id === field.id
                          )}].name`}
                          control={form.control}
                          defaultValue=""
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                {/* @ts-ignore */}
                                <Input {...field} placeholder="Name" />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          //@ts-ignore
                          name={`coordinators[${fields.findIndex(
                            (e) => e.id === field.id
                          )}].email`}
                          control={form.control}
                          defaultValue=""
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                {/* @ts-ignore */}
                                <Input {...field} placeholder="Email" />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      <TableCell>
                        <FormField
                          //@ts-ignore
                          name={`coordinators[${fields.findIndex(
                            (e) => e.id === field.id
                          )}].contNo`}
                          control={form.control}
                          defaultValue=""
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                {/* @ts-ignore */}
                                <Input {...field} placeholder="Contact No" />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      <TableCell>
                        <FormField
                          //@ts-ignore
                          name={`coordinators[${fields.findIndex(
                            (e) => e.id === field.id
                          )}].department`}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  //@ts-ignore
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="md:w-[180px]">
                                      <SelectValue placeholder="Department" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="IT">
                                      IT Department
                                    </SelectItem>
                                    <SelectItem value="COMMERCE">
                                      Commerce Department
                                    </SelectItem>
                                    <SelectItem value="LAW">
                                      Law Department
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <tr className="h-32">
                    <td className="text-center" colSpan={6}>
                      No faculty coordinators added
                    </td>
                  </tr>
                )}
              </TableBody>
            </Table>
          </div>

          <Separator className="h-[0.5px]" />

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium leading-none">
                STUDENT COORDINATORS
              </span>
              <Button
                type="button"
                variant="default"
                size="default"
                onClick={() =>
                  append({
                    name: "",
                    email: "",
                    contNo: "",
                    type: "STUDENT",
                    batchStartDate: "2021",
                    batchEndDate: "2023",
                  })
                }
              >
                <AiOutlinePlusCircle className="mr-2 h-4 w-4" />
                Add New
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Contact No</TableHead>
                  <TableHead>Batch Start Year</TableHead>
                  <TableHead>Batch End Year</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentFields.length ? (
                  studentFields.map((field, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <FormField
                          //@ts-ignore
                          name={`coordinators[${fields.findIndex(
                            (e) => e.id === field.id
                          )}].name`}
                          control={form.control}
                          defaultValue=""
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                {/* @ts-ignore */}
                                <Input {...field} placeholder="Name" />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          //@ts-ignore
                          name={`coordinators[${fields.findIndex(
                            (e) => e.id === field.id
                          )}].email`}
                          control={form.control}
                          defaultValue=""
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                {/* @ts-ignore */}
                                <Input {...field} placeholder="Email" />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      <TableCell>
                        <FormField
                          //@ts-ignore
                          name={`coordinators[${fields.findIndex(
                            (e) => e.id === field.id
                          )}].contNo`}
                          control={form.control}
                          defaultValue=""
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                {/* @ts-ignore */}
                                <Input {...field} placeholder="Contact No" />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>

                      <TableCell>
                        <FormField
                          //@ts-ignore
                          name={`coordinators[${fields.findIndex(
                            (e) => e.id === field.id
                          )}].batchStartDate`}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  //@ts-ignore
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="md:w-[180px]">
                                      <SelectValue placeholder="Batch Start Year" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <ScrollArea className="h-64">
                                      <SelectItem value="2019">2019</SelectItem>
                                      <SelectItem value="2020">2020</SelectItem>
                                      <SelectItem value="2021">2021</SelectItem>
                                      <SelectItem value="2022">2022</SelectItem>
                                      <SelectItem value="2023">2023</SelectItem>
                                      <SelectItem value="2024">2024</SelectItem>
                                      <SelectItem value="2025">2025</SelectItem>
                                      <SelectItem value="2026">2026</SelectItem>
                                      <SelectItem value="2027">2027</SelectItem>
                                      <SelectItem value="2028">2028</SelectItem>
                                      <SelectItem value="2029">2029</SelectItem>
                                      <SelectItem value="2030">2030</SelectItem>
                                      <SelectItem value="2031">2031</SelectItem>
                                      <SelectItem value="2032">2032</SelectItem>
                                      <SelectItem value="2033">2033</SelectItem>
                                      <SelectItem value="2034">2034</SelectItem>
                                      <SelectItem value="2035">2035</SelectItem>
                                      <SelectItem value="2036">2036</SelectItem>
                                      <SelectItem value="2037">2037</SelectItem>
                                      <SelectItem value="2038">2038</SelectItem>
                                      <SelectItem value="2039">2039</SelectItem>
                                      <SelectItem value="2040">2040</SelectItem>
                                      <SelectItem value="2041">2041</SelectItem>
                                      <SelectItem value="2042">2042</SelectItem>
                                      <SelectItem value="2043">2043</SelectItem>
                                      <SelectItem value="2044">2044</SelectItem>
                                      <SelectItem value="2045">2045</SelectItem>
                                      <SelectItem value="2046">2046</SelectItem>
                                    </ScrollArea>
                                  </SelectContent>
                                </Select>
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <FormField
                          //@ts-ignore
                          name={`coordinators[${fields.findIndex(
                            (e) => e.id === field.id
                          )}].batchEndDate`}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  //@ts-ignore
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger className="md:w-[180px]">
                                      <SelectValue placeholder="Batch End Year" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <ScrollArea className="h-64">
                                      <SelectItem value="2019">2019</SelectItem>
                                      <SelectItem value="2020">2020</SelectItem>
                                      <SelectItem value="2021">2021</SelectItem>
                                      <SelectItem value="2022">2022</SelectItem>
                                      <SelectItem value="2023">2023</SelectItem>
                                      <SelectItem value="2024">2024</SelectItem>
                                      <SelectItem value="2025">2025</SelectItem>
                                      <SelectItem value="2026">2026</SelectItem>
                                      <SelectItem value="2027">2027</SelectItem>
                                      <SelectItem value="2028">2028</SelectItem>
                                      <SelectItem value="2029">2029</SelectItem>
                                      <SelectItem value="2030">2030</SelectItem>
                                      <SelectItem value="2031">2031</SelectItem>
                                      <SelectItem value="2032">2032</SelectItem>
                                      <SelectItem value="2033">2033</SelectItem>
                                      <SelectItem value="2034">2034</SelectItem>
                                      <SelectItem value="2035">2035</SelectItem>
                                      <SelectItem value="2036">2036</SelectItem>
                                      <SelectItem value="2037">2037</SelectItem>
                                      <SelectItem value="2038">2038</SelectItem>
                                      <SelectItem value="2039">2039</SelectItem>
                                      <SelectItem value="2040">2040</SelectItem>
                                      <SelectItem value="2041">2041</SelectItem>
                                      <SelectItem value="2042">2042</SelectItem>
                                      <SelectItem value="2043">2043</SelectItem>
                                      <SelectItem value="2044">2044</SelectItem>
                                      <SelectItem value="2045">2045</SelectItem>
                                      <SelectItem value="2046">2046</SelectItem>
                                    </ScrollArea>
                                  </SelectContent>
                                </Select>
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <tr className="h-32">
                    <td className="text-center" colSpan={6}>
                      No student coordinators added
                    </td>
                  </tr>
                )}
              </TableBody>
            </Table>
          </div>

          <Separator />

          <div>
            <div className="md:grid flex flex-col grid-cols-8 gap-4">
              <FormField
                //@ts-ignore
                name="imgs"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-4 lg:col-span-6 sm:col-span-5">
                    <FormLabel>EVENT IMAGES</FormLabel>
                    <FormControl>
                      <Upload
                        className="col-span-1"
                        title={
                          event
                            ? "Click here to upload more images"
                            : "Click here to upload event images"
                        }
                        icon={<PiImagesSquareThin className="text-6xl" />}
                        onChange={(e) => {
                          convertFilesToBase64Array(
                            e.target.files,
                            (base64Array: any) => {
                              field.onChange(base64Array);
                              form.setValue("images", base64Array);
                            }
                          );
                        }}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                //@ts-ignore
                name="coverImage"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-4 lg:col-span-2 sm:col-span-3">
                    <FormLabel>EVENT COVER IMAGE</FormLabel>
                    <FormControl>
                      <Upload
                        className="col-span-1"
                        title={
                          event
                            ? "Click here to change the cover image"
                            : "Click here to upload cover image"
                        }
                        icon={<PiImageSquareThin className="text-6xl" />}
                        multiple={false}
                        onChange={(e) => {
                          convertFilesToBase64Array(
                            e.target.files,
                            (base64Array: any) => {
                              field.onChange(base64Array[0]); // Array of base64 encoded files
                            }
                          );
                        }}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {!!coverImage && (
              <div className="my-6 space-y-6">
                <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  EVENT COVER IMAGE
                </span>
                <div className="max-h-[400px] overflow-auto">
                  <div className="grid grid-cols-4 gap-4 mr-2">
                    <div className="overflow-hidden rounded-md aspect-video border">
                      <Image
                        src={
                          coverImage.url.startsWith("uploads")
                            ? `${process.env.NEXT_PUBLIC_UPLOAD_DIRECTORY}/${coverImage.url}`
                            : coverImage.url
                        }
                        alt={"Event Image"}
                        width={250}
                        height={330}
                        className="h-auto w-auto object-cover aspect-video"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!!(images && images.length) && (
              <div className="my-6 space-y-6">
                <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  EVENT IMAGES
                </span>
                <div className="max-h-[400px] overflow-auto">
                  <div className="md:grid grid-cols-4 flex flex-col gap-4 mr-2">
                    {images.map(
                      (img: { url: string; name: string }, index: number) => (
                        <div
                          key={index}
                          className="overflow-hidden rounded-md aspect-video border"
                        >
                          <Image
                            src={
                              img.url.startsWith("uploads")
                                ? `${process.env.NEXT_PUBLIC_UPLOAD_DIRECTORY}/${img.url}`
                                : img.url
                            }
                            alt={"Event Image"}
                            width={250}
                            height={330}
                            className="h-auto w-auto object-cover aspect-video"
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator className="h-[0.5px]" />

          <FormField
            //@ts-ignore
            name="report"
            control={form.control}
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel>EVENT REPORT</FormLabel>

                <FormControl>
                  <Upload
                    className="col-span-1"
                    multiple={false}
                    accept=".docx"
                    title={
                      event
                        ? "Click here to change event report"
                        : "Click here to upload event report"
                    }
                    icon={
                      <HiOutlineDocumentReport
                        className="text-6xl mr-2"
                        strokeWidth="1"
                      />
                    }
                    onChange={(e) => {
                      convertFilesToBase64Array(
                        e.target.files,
                        (base64Array: any) => {
                          field.onChange(base64Array[0]); // Array of base64 encoded files
                        }
                      );
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              className="mb-4"
              type="submit"
              disabled={isLoading}
              isLoading={isLoading}
            >
              {event ? "Update Event" : "Create Event"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
