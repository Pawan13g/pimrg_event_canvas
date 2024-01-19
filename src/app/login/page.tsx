"use client";

// NEXTJS CORE
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

// HOOKS
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

// HTTP LIBS
import axios, { AxiosResponse } from "axios";

// ACTIONS
import { loginUser } from "./session.slice";

// FORM UITILS
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormSchema, LoginFormType } from "./form.schema";

// UI COMPONENTS
import toast from "react-hot-toast";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";

import { Button, buttonVariants } from "@/shared/components/ui/button";

import { Input } from "@/shared/components/ui/input";

import { Checkbox } from "@/shared/components/ui/checkbox";

// ICONS
import { Eye, EyeOff, HomeIcon, Loader } from "lucide-react";
import { AiFillLock, AiFillMail } from "react-icons/ai";

// UTILS FUNCTIONS
import { cn } from "@/shared/utils/utils";

// API ENDPOINTS
import { GET_USER, LOGIN_USER } from "@/shared/constants/endpoint";

// TYPES
import { user } from "@prisma/client";
import { APIResponse } from "@/shared/constants/types";

// UTIL FUNCTIONS
import { setAuthKey } from "@/shared/utils/cookies";

// ACTION FUNCTION
async function LoginUser(data: LoginFormType) {
  try {
    const {
      data: {
        data: { authKey },
      },
    }: AxiosResponse<APIResponse<{ authKey: string }>> = await axios.post(
      LOGIN_USER,
      data
    );

    // set cookies for session
    setAuthKey(authKey, data.isRememberMe);

    // get user info
    const {
      data: { data: user },
    }: AxiosResponse<APIResponse<user>> = await axios.get(GET_USER, {
      headers: { Authorization: `Bearer ${authKey}` },
    });

    return user;
  } catch (error: any) {
    throw error.response.data;
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
    if (isError) toast.error(<b>{error.msg}</b>);
  }, [isError, error]);

  useEffect(() => {
    if (data) {
      dispatch(loginUser(data));
      redirect("/");
    }
  }, [dispatch, data]);

  const form = useForm<LoginFormType>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: { email: "", password: "", isRememberMe: false },
  });

  return (
    <>
      <div className="container relative flex flex-col h-screen items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href="/event"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          <HomeIcon size={18} />
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r md:hidden">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Image
              className="object-contain"
              height={100}
              width={100}
              src="/logo.png"
              alt="logo"
            />
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                This library has saved me countless hours of work and helped me
                deliver stunning designs to my clients faster than ever before.
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div>
        </div>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:p-8">
          <div className="flex flex-col space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to login into your account
            </p>
          </div>

          <div className={cn("grid gap-6")}>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) => mutate(data))}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          rootClassName="bg-secondary"
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
                        <div className="relative">
                          <Input
                            placeholder="Password"
                            rootClassName="bg-secondary"
                            icon={<AiFillLock />}
                            type={isPasswordVisible ? "password" : "text"}
                            {...field}
                          />
                          <span
                            className="absolute top-[50%] cursor-pointer right-2 translate-x-[-50%] translate-y-[-50%]"
                            onClick={() =>
                              setPasswordVisible(!isPasswordVisible)
                            }
                          >
                            {isPasswordVisible ? (
                              <Eye size={16} />
                            ) : (
                              <EyeOff size={16} />
                            )}
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
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0 text-xs sm:text-base">
                          Remember Me
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={cn("!mt-8 w-full flex items-center")}
                >
                  {isLoading ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin duration-1000" />
                  ) : null}
                  <span>Login</span>
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
