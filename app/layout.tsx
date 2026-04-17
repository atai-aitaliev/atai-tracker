import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Atai Tracker",
  description: "Личный трекер: сон, приоритеты, тазкия, тренировки",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="bg-[#FAFAF8] text-[#1A1A1A] antialiased">
        {children}
      </body>
    </html>
  );
}
