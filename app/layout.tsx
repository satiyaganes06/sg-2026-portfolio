import type { Metadata } from "next";
import { Inter, Walter_Turncoat } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const walterTurncoat = Walter_Turncoat({
  variable: "--font-walter-turncoat",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Shatthiya Ganes",
  description: "Portfolio of Shatthiya Ganes — Software Developer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${walterTurncoat.variable} antialiased font-mono bg-black`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
