import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AITableProvider } from "@/lib/contexts/aitable-context";
import config from "@/lib/config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: config.app.name,
  description: config.app.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <AITableProvider>
          {children}
        </AITableProvider>
      </body>
    </html>
  );
}
