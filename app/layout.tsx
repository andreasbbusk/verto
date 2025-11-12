import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/modules/components/ui/sonner";
import { AppLayout } from "@/modules/components/layout/app-layout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Flashcards App - Lær med flashcards",
  description:
    "En moderne flashcard applikation til effektiv læring og hukommelse",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="da">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppLayout>{children}</AppLayout>
        <Toaster />
      </body>
    </html>
  );
}
