import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.scss'
import { ClerkProvider } from '@clerk/nextjs'
import { ConvexClientProvider } from "./ConvexClientProvider";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://hypeshelf-mu.vercel.app/"),
  title: "HypeShelf",
  description:
    "Collect and share the stuff you're hyped about. A shared recommendations shelf for friends.",
  openGraph: {
    title: "HypeShelf",
    description:
      "Collect and share the stuff you're hyped about. A shared recommendations shelf for friends.",
    url: "https://hypeshelf-mu.vercel.app/",
    siteName: "HypeShelf",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "HypeShelf",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HypeShelf",
    description:
      "Collect and share the stuff you're hyped about. A shared recommendations shelf for friends.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClerkProvider dynamic>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
