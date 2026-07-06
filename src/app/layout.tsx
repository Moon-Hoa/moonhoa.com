import type { Metadata } from "next";
import {
  Playfair_Display,
  EB_Garamond,
  Cormorant_SC,
  Source_Serif_4,
} from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-garamond",
});

const cormorantSC = Cormorant_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant-sc",
});

const sourceSerif4 = Source_Serif_4({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-source-serif",
});

export const metadata: Metadata = {
  title: "Moon Homeowners Association — Official Portal",
  description:
    "Upholding property standards, community decorum, and dust displacement regulations across all crater-side developments since 2069.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${ebGaramond.variable} ${cormorantSC.variable} ${sourceSerif4.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
