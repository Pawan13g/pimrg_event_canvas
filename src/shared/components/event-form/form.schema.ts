// FORM UTILITIES
import * as z from "zod"

export const EventFormSchema = z.object({
    name:
        z.string()
            .min(2, {
                message: "event name must be at least 2 characters.",
            })
            .max(60, {
                message: "event name must not be longer than 60 characters.",
            }),
    description: z.string().max(400).min(4),
    organizer:
        z.string({
            required_error: "Please select event orgraniser.",
        }),
    startDate: z.date({
        required_error: "Event start date is required.",
    }),
    endDate: z.date({
        required_error: "Event end date is required.",
    }),
    startTime: z.date({
        required_error: "Event start time is required.",
    }),
    endTime: z.date({
        required_error: "Event end time is required.",
    }),
    coordinators:
        z.array(
            z.object({
                name: z.string({ required_error: "Name is required.", })
                    .max(40, {
                        message: "Name must be not more then 40 characters",
                    }
                    ).min(4, {
                        message: "Name must be at least 40 characters",
                    }),

                email: z.string({ required_error: "Email is required.", })
                    .email({
                        message: 'Email must be valid',
                    }),

                contNo: z.string({ required_error: "Contact no is required." })
                    .max(10, {
                        message: "Contact number must be not more then 10 characters",
                    }
                    ).min(10, {
                        message: "Contact number must be at least 10 characters",
                    }),

                department: z.enum(["COMMERCE", "IT", "LAW"]).optional(),
                batchStartDate: z.string({ required_error: "Batch start year is required." }).optional(),
                batchEndDate: z.string({ required_error: "Batch end year required." }).optional(),
                type: z.enum(["FACULTY", "STUDENT"]),
            })
        ),
    images: z.array(
        z.object({
            name: z.string(),
            url: z.string()
        })
    ).optional(),

    report: z.object({
        name: z.string({ required_error: "report name is required.", }),
        url: z.string()
    }).optional(),

    coverImage: z.object({
        name: z.string(),
        url: z.string()
    }).optional(),
})

export type EventFormValues = z.infer<typeof EventFormSchema>
