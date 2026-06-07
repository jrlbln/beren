import type { Metadata, Viewport } from "next";
import { TabBar } from "@/components/UI/TabBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "ベレン",
  description: "A Japanese language learning app for kana study and review.",
  applicationName: "ベレン",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="h-full bg-background text-foreground">
        <div className="flex min-h-full flex-col">
          <TabBar />
          <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col overflow-visible px-3 py-4 sm:px-4 sm:py-5 lg:px-5">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
