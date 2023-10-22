"use client";
import Header from '@/shared/components/layouts/header'
import './globals.css'
import SideBar from '@/shared/components/layouts/sidebar'
import { Provider } from 'react-redux';
import { store } from '@/shared/rdx/store'
import { Toaster } from '@/shared/components/ui/toaster';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from '@/shared/components/ui/tooltip';
import Breadcrumb from '@/shared/components/ui/breadcrumb';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <QueryClientProvider client={new QueryClient()}>
        <TooltipProvider>
          <body className='overflow-hidden'>
            <Provider store={store}>
              <Header />
              <div className='flex w-full'>
                <SideBar />
                <div className='px-4 py-6 lg:px-8 w-full h-[calc(100vh_-_50px)] overflow-auto'>
                  <Breadcrumb />
                  {children}
                </div>
              </div>
              <Toaster />
            </Provider>
          </body>
        </TooltipProvider>
      </QueryClientProvider>
    </html>
  )
}
