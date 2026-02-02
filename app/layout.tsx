import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'NexAPI - Unified AI API Platform',
  description: 'Access the world\'s best AI models through a single API. Video, Image, Music, and LLM models — all in one place.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Navbar />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
