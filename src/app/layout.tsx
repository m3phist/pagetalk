import { ClerkProvider, auth } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';

import './globals.css';
import { cn } from '@/lib/utils';
import { Navbar } from '@/components/Navbar';

import { Providers } from '@/components/Providers';

import 'react-loading-skeleton/dist/skeleton.css';
import 'simplebar-react/dist/simplebar.min.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pagetalk',
  description: 'Chat with your PDF documents',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();

  return (
    <ClerkProvider>
      <html lang="en">
        <Providers>
          <body
            className={cn(
              'min-h-screen font-sans antialiased grainy',
              inter.className
            )}
          >
            <Navbar />
            {children}
            <Toaster />
          </body>
        </Providers>
      </html>
    </ClerkProvider>
  );
}
