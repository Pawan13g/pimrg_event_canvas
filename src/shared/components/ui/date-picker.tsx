import React from "react";
import { FormControl } from "./form";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { cn } from "@/shared/utils/utils";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./calendar";

type Props = {
  field: any;
};

const DatePicker = (props: Props) => {
  const { field } = props;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant={"outline"}
            className={cn(
              "w-full pl-3 text-left font-normal hover:border-gray-400 focus:border-gray-400",
              !field.value && "text-muted-foreground"
            )}
          >
            {field.value ? (
              format(field.value, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={field.value}
          onSelect={field.onChange}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
