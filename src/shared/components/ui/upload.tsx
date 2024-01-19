import * as React from "react"

import { cn } from "@/shared/utils/utils"

import { PiImagesSquareThin } from 'react-icons/pi'

export interface UploadProps
    extends React.InputHTMLAttributes<HTMLInputElement> { icon?: React.ReactNode }

const Upload = React.forwardRef<HTMLInputElement, UploadProps>(
    ({ className, type, title, icon, ...props }, ref) => {
        return (
            <div className="flex justify-center w-full rounded-md border-2 border-dashed border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground hover:border-gray-400 focus:border-gray-400 focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 relative">
                <input
                    type="file"
                    multiple
                    className={cn(
                        "opacity-0 h-full w-full absolute",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                <div className="flex flex-col justify-center items-center my-6 space-y-4">
                    {icon}
                    <span>{title}</span>
                </div>
            </div>
        )
    }
)
Upload.displayName = "Upload"

export { Upload }
