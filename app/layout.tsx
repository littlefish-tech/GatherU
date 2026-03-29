import type { Metadata } from "next"
import "./globals.css"
import { cn } from "@/lib/utils"
import LightRays from "@/components/LightRays"
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
      <body className="min-h-full flex flex-col">
        <Navbar />
        <div className="absolute inset-0 top-0 z-[-1] min-h-screen">
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffffff"
            raysSpeed={1}
            lightSpread={0.5}
            rayLength={3}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0}
            distortion={0}
            className="custom-rays"
            pulsating={false}
            fadeDistance={1}
            saturation={1}
          />
        </div>
        <main>{children}</main>
      </body>
    </html>
  )
}
