import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Sport Meet - ITUM | Inter-House Championship',
  description: 'Experience the ultimate inter-house sports competition at ITUM - Live scores, events, and glory',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: 'https://iqwpccaklgcetfwbkalb.supabase.co/storage/v1/object/public/images/meet%20logo.png',
        type: 'image/png',
      },
    ],
    apple: 'https://iqwpccaklgcetfwbkalb.supabase.co/storage/v1/object/public/images/meet%20logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased bg-background text-foreground flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 pt-20">
          {children}
        </div>
        <Footer />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
