import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import ScrollAnimations from "./components/animations/ScrollAnimations";

const manrope = localFont({
  src: "../public/fonts/Manrope-VariableFont_wght.ttf",
  variable: "--font-manrope",
  display: "swap",
  weight: "400 500 600 700 800",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.privitty.com"),

  title: {
    default: "Privitty - Machine Identity & Secure Remote Access for OT",
    template: "%s | Privitty",
  },

  description:
    "Privitty gives every machine a cryptographic identity and every engineer verified, revokable access: no VPN, no firewall rules, no hardware. Built for OT.",

  applicationName: "Privitty",

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },

  openGraph: {
    title: "Privitty - Machine Identity & Secure Remote Access for OT",
    description:
      "Privitty gives every machine a cryptographic identity and every engineer verified, revokable access: no VPN, no firewall rules, no hardware. Built for OT.",
    url: "https://www.privitty.com",
    siteName: "Privitty",
    images: [
      {
        url: "/preview.png",
        width: 1200,
        height: 630,
        alt: "Privitty - Machine Identity & Secure Remote Access for OT",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Privitty - Machine Identity & Secure Remote Access for OT",
    description:
      "Privitty gives every machine a cryptographic identity and every engineer verified, revokable access: no VPN, no firewall rules, no hardware. Built for OT.",
    images: [
      {
        url: "/preview.png",
        alt: "Privitty — Identity-First Security",
      },
    ],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} ${newsreader.variable} antialiased selection:bg-[#4c3298]/20 selection:text-[#4c3298]`}
    >
      <body className="min-h-screen bg-[#F8F5FF] text-[#17151D] flex flex-col font-sans">
        <ScrollAnimations>
          {children}
        </ScrollAnimations>
      </body>
    </html>
  );
}
