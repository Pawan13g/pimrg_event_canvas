"use client";

// GLOBAL STYLES
import './globals.css'

// NOTIFICATION TOASTER
import { Toaster } from 'react-hot-toast';

// PROVIDERS
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from '@/shared/components/ui/tooltip';

// REDUX STORE
import { store } from '@/shared/rdx/store'

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
              {children}
              <Toaster />
            </Provider>
          </body>
        </TooltipProvider>
      </QueryClientProvider>
    </html>
  )
}
