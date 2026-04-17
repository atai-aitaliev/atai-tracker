import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ServiceWorkerRegistration } from "./components/ServiceWorkerRegistration";

export const metadata: Metadata = {
  title: "Atai Tracker",
  description: "Личный трекер: сон, приоритеты, тазкия, тренировки",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Atai Tracker",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-512.png",
  },
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
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
