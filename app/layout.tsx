import type React from "react"
import "@/app/globals.css"
import { Prompt, IBM_Plex_Sans_Thai } from "next/font/google" // เพิ่ม IBM Plex Sans Thai
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"

// ตั้งค่าฟอนต์ Prompt
// const prompt = Prompt({ subsets: ["thai"], weight: ["100", "200", "300"] })

// ตั้งค่าฟอนต์ IBM Plex Sans Thai
const ibmPlexSansThai = IBM_Plex_Sans_Thai({ subsets: ["thai"], weight: ["400", "700"] })

export const metadata = {
  title: "English-Thai Vocabulary Quiz",
  description: "Learn English-Thai vocabulary with an interactive quiz application",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* ใช้ฟอนต์ IBM Plex Sans Thai */}
      <body className={`${ibmPlexSansThai.className}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="min-h-screen flex flex-col relative">
            <header className="border-b">
              {/* <div className="container flex items-center justify-between h-14">
                <h1 className="text-lg font-bold">Vocabulary Quiz</h1>
              </div> */}
            </header>
            <main className="flex-1">{children}</main>
            <div className="absolute bottom-4 right-4">
              <ThemeToggle />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

import './globals.css'