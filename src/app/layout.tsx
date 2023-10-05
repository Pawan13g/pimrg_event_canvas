"use client";

import Header from '@/shared/components/layouts/header'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import SideBar from '@/shared/components/layouts/sidebar'
import { Provider } from 'react-redux';
import { store } from '@/shared/rdx/store'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <Header />
          <div className='flex min-h-[calc(100vh_-_50px)] w-full'>
            <SideBar />
            <div className='px-4 py-6 lg:px-8 w-full h-[calc(100vh_-_50px)] overflow-auto'>{children}</div>
          </div>
        </Provider>
      </body>
    </html>
  )
}
