import type { Metadata } from 'next';
import { Geist_Mono, Inter } from 'next/font/google';

import './globals.css';

import { Providers } from './providers';
import { SiteHeader } from '@/widgets/site-header/ui/site-header';
import { SiteFooter } from '@/widgets/site-footer/ui/site-footer';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Marketplace',
  description: 'Marketplace application',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable} dark h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Providers>
          <SiteHeader />

          <main className="flex-1">{children}</main>

          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
