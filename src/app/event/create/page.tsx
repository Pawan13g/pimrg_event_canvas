"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/shared/utils/utils"
import { Button } from "@/shared/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/components/ui/form";

import { Input } from "@/shared/components/ui/input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";

import { Textarea } from "@/shared/components/ui/textarea"
import { toast } from "@/shared/components/ui/use-toast"
import { Separator } from "@radix-ui/react-menubar"

const profileFormSchema = z.object({
    eventName: 
    z.string()
        .min(2, {
            message: "event name must be at least 4 characters.",
        })
        .max(60, {
            message: "event name must not be longer than 60 characters.",
        }),
    eventDescription: z.string().max(400).min(4),
    eventOrganiser:
        z.string({
            required_error: "Please select event orgraniser.",
        }),
    urls:
        z.array(
            z.object({
                value: z.string().url({ message: "Please enter a valid URL." }),
            })
        ).optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
    urls: [
        { value: "https://shadcn.com" },
        { value: "http://twitter.com/shadcn" },
    ],
}

export default function ProfileForm() {
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues,
        mode: "onChange",
    })

    const { fields, append } = useFieldArray({
        name: "urls",
        control: form.control,
    })

    function onSubmit(data: ProfileFormValues) {
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
    }

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Create Event</h3>
                <p className="text-sm text-muted-foreground">
                    This is how others will see you on the site.
                </p>
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="eventName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>NAME</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter name" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This will the name of the event which will be displayed everywhere
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="eventDescription"
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
                                    Enter the short details or discription of the event
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="eventOrganiser"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ORGANISER</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a verified email to display" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="m@example.com">m@example.com</SelectItem>
                                        <SelectItem value="m@google.com">m@google.com</SelectItem>
                                        <SelectItem value="m@support.com">m@support.com</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    By whom the event is organiazed
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div>
                        {fields.map((field, index) => (
                            <FormField
                                control={form.control}
                                key={field.id}
                                name={`urls.${index}.value`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className={cn(index !== 0 && "sr-only")}>
                                            URLs
                                        </FormLabel>
                                        <FormDescription className={cn(index !== 0 && "sr-only")}>
                                            Add links to your website, blog, or social media profiles.
                                        </FormDescription>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => append({ value: "" })}
                        >
                            Add URL
                        </Button>
                    </div>
                    <Button type="submit">Update profile</Button>
                </form>
            </Form>
        </div>

    )
}