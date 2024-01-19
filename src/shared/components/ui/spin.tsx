import { cn } from '@/shared/utils/utils';
import React from 'react'

type Props = { className?: string }

const Spinner = (props: Props) => {
    const { className } = props;
    return (
        <div className={cn("absolute top-1/2 right-1/2", className)}>
            <div className="w-12 h-12 rounded-full absolute border-8 border-solid border-gray-200"></div>
            <div className="w-12 h-12 rounded-full animate-spin absolute border-8 border-solid border-purple-500 border-t-transparent"></div>
        </div>
    )
}

export default Spinner