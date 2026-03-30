import type { Metadata } from "next"
import "./globals.css"
import { cn } from "@/lib/utils"
import Navbar from "@/components/Navbar"

export const metadata: Metadata = {
  title: "GatherU | Campus Events Platform",
  description:
    "Discover, explore, and RSVP to campus events like workshops, hackathons, and career fairs.",
  icons: {
    icon: "/icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("min-h-screen", "antialiased", "font-sans")}
    >
      <body className="min-h-full bg-slate-50 text-slate-900">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
