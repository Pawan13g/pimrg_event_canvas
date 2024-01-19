// FORM UTILITIES
import * as z from "zod"

export const LoginFormSchema = z.object({
    email: z.string({ required_error: 'Email is required' }).email({ message: 'Email must be valid' }),
    password: z.string({ required_error: 'Password is required' }),
    isRememberMe: z.boolean().default(false).optional(),
})

export type LoginFormType = z.infer<typeof LoginFormSchema>
