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
import { ThemeProvider } from '@/shared/components/theme-provider/theme-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en" suppressHydrationWarning>

      <QueryClientProvider client={new QueryClient()}>
        <body>
          <Provider store={store}>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <TooltipProvider>
                {children}
                <Toaster />
              </TooltipProvider>
            </ThemeProvider>
          </Provider>
        </body>
      </QueryClientProvider>
    </html>
  )
}
