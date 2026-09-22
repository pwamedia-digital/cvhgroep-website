import type { Metadata } from "next";
import { Alegreya, Alegreya_Sans } from "next/font/google";
import "./globals.css";

const alegreya = Alegreya({
  subsets: ["latin"],
  variable: "--font-alegreya",
  display: "swap",
});

const alegreyaSans = Alegreya_Sans({
  subsets: ["latin"],
  variable: "--font-alegreya-sans",
  display: "swap",
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: "CVH Groep | Renovaties & Totaalprojecten in Oostende",
  description:
    "CVH Groep begeleidt renovaties en totaalprojecten in Oostende en omstreken, van offerte tot afwerking.",
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="nl">
      <body className={`${alegreya.variable} ${alegreyaSans.variable}`}>{children}</body>
    </html>
  );
}
