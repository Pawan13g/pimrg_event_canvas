// REACT ESSENTIALS
import React, { useMemo } from "react";

// NEXTJS CORE
import Link from "next/link";
import Image from "next/image";

// SHADCN THEMING CORE
import { useTheme } from "next-themes";

// HOOKS
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter, useSearchParams } from "next/navigation";

// ACTIONS
import { logoutUser } from "@/app/login/session.slice";

// UI COMPONENTS

import { Menubar } from "@/shared/components/ui/menubar";

import { Button, buttonVariants } from "../ui/button";

import { Separator } from "../ui/separator";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { Calendar } from "../ui/calendar";

// ICONS
import { AiOutlineLogout } from "react-icons/ai";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

import { RotateCcw, Search } from "lucide-react";

// TYPES
import { IAppState } from "@/shared/rdx/store";
import { DateRange } from "react-day-picker";
import { cn } from "@/shared/utils/utils";

const Header = () => {
  // HOOKS INSTANCES
  const dispatch = useDispatch();
  const { setTheme } = useTheme();
  const params = useSearchParams();

  // PARAMS OBJECT
  const { name, to, from } = Object.fromEntries(params.entries());

  // STORE DATA
  const user = useSelector((state: IAppState) => state.session.user);

  // USE STATES
  const [date, setDate] = React.useState<DateRange | undefined>();

  const [searchTerm, setSearchTerm] = React.useState<string | undefined>("");

  // USE MEMOS
  const isFilterNeedsReset = useMemo(() => {
    return name || searchTerm || to || from || date?.from || date?.to;
  }, [searchTerm, date, params]);

  return (
    <Menubar className="fixed top-0 w-full border-x-0 px-2 lg:px-4 rounded-none justify-between h-max z-10 ">
      <div className="flex items-center gap-3">
        <Image
          className="object-contain"
          height={50}
          width={50}
          src="/logo.png"
          alt="logo"
        />

        <Separator
          orientation="vertical"
          className="hidden sm:flex h-8 w-0.5"
        />

        <div className="hidden sm:flex items-end ">
          <span className="font-bold text-gray-600 dark:text-primary-foreground text-lg">
            PIMRG
          </span>
          &nbsp;
          <span className="font-bold text-purple-600 text-lg">EVENT</span>
          &nbsp;
          <span className="font-bold text-gray-600 text-end text-xs dark:text-primary-foreground">
            REPO
          </span>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <Dialog>
          <DialogTrigger
            className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
          >
            <Search size={16} />
          </DialogTrigger>
          <DialogContent closeIconClassName="bg-transparent dark:text-white  top-3 shadow-none">
            <DialogHeader className="relative space-y-0 shadow-none flex items-center bg-transparent antialiased p-0 rounded-none">
              <input
                type="text"
                disabled={!!date?.to || !!date?.from}
                className="bg-transparent py-3 pl-12 pr-4 focus-visible:ring-0 placeholder:text-sm w-full outline-none disabled:cursor-not-allowed"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search events..."
              />
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2"
                size={16}
              />
            </DialogHeader>

            <div className="p-4 pt-0">
              <Calendar
                className="p-0"
                disabled={!!searchTerm}
                mode="range"
                selected={date}
                onSelect={setDate}
              />

              <DialogClose asChild>
                <Link
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "w-full mt-4",
                    !searchTerm &&
                      (!date?.to || !date?.from) &&
                      "pointer-events-none opacity-50"
                  )}
                  href={
                    searchTerm
                      ? `/events?name=${searchTerm}`
                      : date?.to && date?.from
                      ? `/event?to=${date.to.toDateString()}&from=${date.from.toDateString()}`
                      : ""
                  }
                >
                  Search
                </Link>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>

        {isFilterNeedsReset && (
          <Link
            href="/"
            className={buttonVariants({ variant: "outline", size: "icon" })}
            onClick={() => (setSearchTerm(""), setDate(undefined))}
          >
            <RotateCcw className="text-red-500" size={16} />
            <span className="sr-only">Reset Filters</span>
          </Link>
        )}

        <Separator className="h-8" orientation="vertical" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {!user ? (
          <Link href="/login">
            <Button className="px-4" size="sm">
              Login
            </Button>
          </Link>
        ) : (
          <Button
            onClick={() => dispatch(logoutUser())}
            variant="outline"
            size="icon"
          >
            <AiOutlineLogout className="text-red-500 text-lg" />
          </Button>
        )}
      </div>
    </Menubar>
  );
};

export default Header;
