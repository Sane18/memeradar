import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { brand } from "@/lib/brand";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${brand.name} — ${brand.tagline}`,
  description: brand.subtitle,
  openGraph: {
    title: `${brand.name} — ${brand.tagline}`,
    description: brand.subtitle,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans bg-chad-bg text-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
