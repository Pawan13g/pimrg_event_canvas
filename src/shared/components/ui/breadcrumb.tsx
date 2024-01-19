import React, { useMemo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Breadcrumb = () => {
    const path = usePathname();

    const pathArr = useMemo(() => {
        const paths = decodeURIComponent(path).split('/')
        paths.shift();
        return paths;
    }, [path]);


    return (
        <ol className="flex w-full flex-wrap items-center rounded-md bg-blue-gray-50 bg-opacity-60 py-2 mb-6">
            {
                pathArr.map((item, index) =>
                    <li key={index} className="flex cursor-pointer items-center font-sans text-sm font-normal leading-normal text-blue-gray-900 antialiased transition-colors duration-300">
                        {
                            index === 0 ? (
                                <>
                                    <Link href={`/${pathArr[0]}`} className="opacity-80 hover:text-purple-500">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                                        </svg>
                                    </Link>
                                    <span className="pointer-events-none mx-2 select-none font-sans text-sm font-normal leading-normal text-blue-gray-500 antialiased">
                                        /
                                    </span>
                                </>
                            )
                                : index === pathArr.length - 1 ? (
                                    <span className='text-purple-500'>{item}</span>
                                ) : (
                                    <Link href={`/${pathArr.slice(0, index + 1).join('/')}`}>
                                        <span className='hover:underline hover:text-purple-500'>{item}</span>
                                        <span className="pointer-events-none mx-2 select-none font-sans text-sm font-normal leading-normal text-blue-gray-500 antialiased">
                                            /
                                        </span>
                                    </Link>
                                )
                        }
                    </li>
                )
            }
        </ol >
    )
}

export default Breadcrumb;