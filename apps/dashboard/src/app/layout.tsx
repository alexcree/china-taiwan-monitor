import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "China–Taiwan Monitor — Daily Intelligence Brief",
  description:
    "Daily classified-style intelligence brief on China–Taiwan developments. Defense, politics, economy, technology — mixed English, mainland, and Taiwan sources.",
  metadataBase: new URL("https://chinataiwanmonitor.com"),
  openGraph: {
    title: "China–Taiwan Monitor",
    description:
      "Daily intelligence brief on China–Taiwan developments. Always free dashboard, premium newsletter.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} dark`}>
      <body className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
