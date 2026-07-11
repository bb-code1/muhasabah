import type { Metadata } from "next";
import "./globals.css";
import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { logoutAction } from '@/actions';

export const metadata: Metadata = {
  title: "Nafs-al-Muhasabah",
  description: "Personal Accountability Tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
