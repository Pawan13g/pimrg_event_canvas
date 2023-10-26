// CLIENT COMPONENT
'use client';

// LIBS
import axios, { AxiosResponse } from 'axios';

// HOOKS
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';


// ACTIONS
import { loginUser } from './session.slice'

// FORM UITILS
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormSchema, LoginFormType } from './form.schema';

//
import { redirect } from 'next/navigation';
// UI COMPONENTS
import toast from 'react-hot-toast';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shared/components/ui/form"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card"

import { Button } from '@/shared/components/ui/button';

import { Input } from "@/shared/components/ui/input"

import { Checkbox } from '@/shared/components/ui/checkbox';
// ICONS
import { AiFillEye, AiFillEyeInvisible, AiFillLock, AiFillMail, AiOutlineLoading } from 'react-icons/ai';

// UTILS FUNCTIONS
import { cn } from '@/shared/utils/utils';

// API ENDPOINTS
import { GET_USER, LOGIN_USER } from '@/shared/constants/endpoint';

// TYPES
import { APIResponse } from '@/shared/constants/types';
import { setAuthKey } from '@/shared/utils/cookies';
import { user } from '@prisma/client';
import { useDispatch } from 'react-redux';



// ACTION FUNCTION
async function LoginUser(data: LoginFormType) {
    try {
        const { data: { data: { authKey } } }: AxiosResponse<APIResponse<{ authKey: string }>> = await axios.post(LOGIN_USER, data);

        // set cookies for session
        setAuthKey(authKey, data.isRememberMe);

        // get user info
        const { data: { data: user } }: AxiosResponse<APIResponse<user>> = await axios.get(GET_USER, { headers: { Authorization: `Bearer ${authKey}` } });

        return user;
    } catch (error: any) {
        throw error.response.data
    }
}

const Login = () => {

    // HOOKS INTANCES
    const dispatch = useDispatch();
    const { isError, error, data, isLoading, mutate } = useMutation(LoginUser);

    // STATES
    const [isPasswordVisible, setPasswordVisible] = useState<boolean>(true);

    useEffect(() => {
        // @ts-ignore
        if (isError) toast.error(<b>{error.msg}</b>,);
    }, [isError]);

    useEffect(() => { if (data) { dispatch(loginUser(data)); redirect('/') } }, [data])

    const form = useForm<LoginFormType>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: { isRememberMe: false },
    });


    return (
        <div className='relative flex justify-center items-center px-2 h-screen bg-slate-800'>
            <Card className='w-full bg-transparent border-none shadow-none sm:border-solid sm:shadow-sm bg-white max-w-md'>

                <CardHeader>
                    <CardTitle className='font-bold text-3xl'>Login</CardTitle>
                    <CardDescription className='text-base !mt-2'>Welcome back! Please login to your account.</CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit((data) => mutate(data))} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>

                                        <FormControl>
                                            <Input
                                                rootClassName='bg-secondary'
                                                icon={<AiFillMail />}
                                                placeholder="Email"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>

                                        <FormControl>
                                            <div className='relative'>
                                                <Input placeholder="Password" rootClassName='bg-secondary' icon={<AiFillLock />} type={isPasswordVisible ? 'password' : 'text'} {...field} />
                                                <span
                                                    className='absolute top-[50%] cursor-pointer right-0 translate-x-[-50%] translate-y-[-50%]'
                                                    onClick={() => setPasswordVisible(!isPasswordVisible)}
                                                >
                                                    {isPasswordVisible ? <AiFillEye /> : <AiFillEyeInvisible />}
                                                </span>
                                            </div>
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="isRememberMe"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between px-2">

                                        <div className='flex items-center gap-2'>
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormLabel className='!mt-0 text-xs sm:text-base'>
                                                Remember Me
                                            </FormLabel>

                                        </div>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isLoading} className={cn('!mt-8 w-full flex items-center')}>
                                {isLoading ? <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" /> : null}
                                <span>Login</span>
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default Login;