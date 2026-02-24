import type { Metadata } from "next";
import { Inter, Walter_Turncoat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

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
  title: "Portfolio of sG",
  description: "Shatthiya Ganes — Full Stack Developer open to overseas & remote roles. Flutter, Laravel, Mobile Security. Based in Malaysia, available worldwide.",
  icons: { icon: "/sg_logo.ico" },
  openGraph: {
    title: "Portfolio of sG",
    description: "Shatthiya Ganes — Full Stack Developer open to overseas & remote roles. Flutter, Laravel, Mobile Security. Based in Malaysia, available worldwide.",
    images: "/og.jpeg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){var t=localStorage.getItem("theme");var m=t==="light"||t==="dark"?t:"dark";document.documentElement.classList.add(m);})();`,
        }}
      />
      <body className={`${inter.variable} ${walterTurncoat.variable} antialiased font-mono bg-background text-foreground`} suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
