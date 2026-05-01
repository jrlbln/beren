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
          <main className="mx-auto flex w-full max-w-384 flex-1 flex-col overflow-visible px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
