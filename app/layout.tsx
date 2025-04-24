import type { Metadata, Viewport } from "next"

import { ThemeProvider } from "@/components/theme-provider"

import "./globals.css"

export const metadata: Metadata = {
  title: "Gamebot AI",
  description: "Gamebot AI is an AI-powered chatbot that helps users search for games, check their availability, and obtain information about promotions and hardware compatibility.",
}

export const viewport: Viewport = {
  width: "device-width",
  colorScheme: "dark",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className="h-screen content-center">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="mx-auto p-6 max-w-2xl">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
