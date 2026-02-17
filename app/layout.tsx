import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { AppProviders } from "@shared/components/app-providers.component";
import { ErrorBoundary } from "@shared/components/error-boundary.component";
import { TabBar } from "@shared/components/tab-bar.component";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pokédex",
  description: "Browse and catch Pokémon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${plusJakartaSans.variable} ${inter.variable} h-full antialiased`}
      >
        <ErrorBoundary>
          <AppProviders>
            <main className="flex-1 overflow-y-auto pb-16">{children}</main>
            <TabBar />
          </AppProviders>
        </ErrorBoundary>
      </body>
    </html>
  );
}
