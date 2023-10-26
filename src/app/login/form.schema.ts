// FORM UTILITIES
import * as z from "zod"

export const LoginFormSchema = z.object({
    email: z.string({ required_error: 'username is required' }).email({ message: 'email must be valid' }),
    password: z.string({ required_error: 'password is required' }),
    isRememberMe: z.boolean().default(false).optional(),
})

export type LoginFormType = z.infer<typeof LoginFormSchema>
