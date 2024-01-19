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
        course: c.course ? c.course : undefined,
        semister: c.semister ? c.semister : undefined,
      })),
    },
  });

  const { fields, append } = useFieldArray({
    name: "coordinators",
    control: form.control,
  });

  const facultyFields = useMemo(
    () => fields.filter((field) => field.type === "FACULTY"),
    [fields]
  );
  const studentFields = useMemo(
    () => fields.filter((field) => field.type === "STUDENT"),
    [fields]
  );
  const [images, setImages] = useState<{ url: string; name: string }[]>([]);

  useEffect(() => {
    if (isSuccess) TagRevalidator(), router.push("/event");
  }, [router, isSuccess]);
  useEffect(() => {
    if (event) setImages(event.images);
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
                    course: "BCA",
                    semister: "1",
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
                  <TableHead>Course</TableHead>
                  <TableHead>Semister</TableHead>
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
                          )}].course`}
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
                                      <SelectValue placeholder="Course" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="BCA">BCA</SelectItem>
                                    <SelectItem value="MBA">MBA</SelectItem>
                                    <SelectItem value="BBA">BBA</SelectItem>
                                    <SelectItem value="BCOM">BCOM</SelectItem>
                                    <SelectItem value="BBA LLB">
                                      BBA LLB
                                    </SelectItem>
                                    <SelectItem value="B.COM LLB">
                                      B.COM LLB
                                    </SelectItem>
                                    <SelectItem value="B.A.LLB">
                                      B.A.LLB
                                    </SelectItem>
                                    <SelectItem value="LL.M">LL.M</SelectItem>
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
                          )}].semister`}
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
                                      <SelectValue placeholder="Semister" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="1">
                                      I<sup>st</sup>
                                    </SelectItem>
                                    <SelectItem value="2">
                                      II<sup>nd</sup>
                                    </SelectItem>
                                    <SelectItem value="3">
                                      III<sup>rd</sup>
                                    </SelectItem>
                                    <SelectItem value="4">
                                      IV<sup>th</sup>
                                    </SelectItem>
                                    <SelectItem value="5">
                                      V<sup>th</sup>
                                    </SelectItem>
                                    <SelectItem value="6">
                                      VI<sup>th</sup>
                                    </SelectItem>
                                    <SelectItem value="7">
                                      VII<sup>th</sup>
                                    </SelectItem>
                                    <SelectItem value="8">
                                      VIII<sup>th</sup>
                                    </SelectItem>
                                    <SelectItem value="9">
                                      IX<sup>th</sup>
                                    </SelectItem>
                                    <SelectItem value="10">
                                      X<sup>th</sup>
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
                      No student coordinators added
                    </td>
                  </tr>
                )}
              </TableBody>
            </Table>
          </div>

          <Separator />

          <div>
            <div className="grid grid-cols-8 gap-4">
              <FormField
                //@ts-ignore
                name="imgs"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-4 col-span-6">
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
                              setImages((prev) => prev.concat(base64Array));
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
                  <FormItem className="space-y-4 col-span-2">
                    <FormLabel>COVER IMAGE</FormLabel>
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
                              setImages((prev) => base64Array.concat(prev));
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

            {!!images.length && (
              <div className="my-6 space-y-6">
                <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  UPLOADED IMAGES
                </span>
                <div className="max-h-[400px] overflow-auto">
                  <div className="grid grid-cols-4 gap-4 mr-2">
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
                            unoptimized={true}
                            alt={"Event Image"}
                            width={250}
                            height={330}
                            className="h-auto w-auto object-cover transition-all hover:scale-105 aspect-video"
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
