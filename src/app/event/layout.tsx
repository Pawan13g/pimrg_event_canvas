"use client"

// LAYOUT COMPONENTS
import Header from '@/shared/components/layouts/header'

// UI COMPONENTS
import DevProfile from '@/shared/components/dev-profile/dev.profile'


export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        <>
            <DevProfile />
            <Header />
            <div className='flex px-4 lg:px-8 my-20'>
                {children}
            </div>
        </>
    )
}
