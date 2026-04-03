import type { Metadata, Viewport } from "next";
import { TabBar } from "@/components/UI/TabBar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Beren",
  description: "A Japanese language learning app for kana study and review.",
  applicationName: "Beren",
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
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)]">
        <div className="flex min-h-screen flex-col">
          <main className="mx-auto flex w-full max-w-[96rem] flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            {children}
          </main>
          <TabBar />
        </div>
      </body>
    </html>
  );
}
