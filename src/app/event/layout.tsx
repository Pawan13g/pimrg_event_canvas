
"use client"

// LAYOUT COMPONENTS
import Header from '@/shared/components/layouts/header'
import Breadcrumb from '@/shared/components/ui/breadcrumb';
import SideBar from '@/shared/components/layouts/sidebar'
import { useDispatch, useSelector } from 'react-redux';
import { IAppState } from '@/shared/rdx/store';
import { useEffect } from 'react';
import { getAuthKey } from '@/shared/utils/cookies';
import { getService } from '@/shared/utils/api.services';
import { GET_USER } from '@/shared/constants/endpoint';
import { user } from '@prisma/client';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    // SESSION COOKIE
    // const authKey = getAuthKey();

    // HOOKS INSTANCES
    const dispatch = useDispatch();
    const user = useSelector((state: IAppState) => state.session.user);



    return (
        <>
            <Header />
            <div className='flex w-full'>
                <SideBar />
                <div className='px-4 py-6 lg:px-8 w-full h-[calc(100vh_-_50px)] overflow-auto'>
                    <Breadcrumb />
                    {children}
                </div>
            </div>
        </>
    )
}
