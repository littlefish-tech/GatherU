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
      <body className="relative min-h-full overflow-x-hidden bg-slate-50 text-slate-900">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(circle_at_top,_rgba(148,234,255,0.32),_transparent_62%)]" />
          <div className="absolute left-[-8rem] top-40 h-72 w-72 rounded-full bg-cyan-100/60 blur-3xl" />
          <div className="absolute right-[-6rem] top-24 h-80 w-80 rounded-full bg-slate-200/70 blur-3xl" />
        </div>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
