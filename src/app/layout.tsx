import type { Metadata, Viewport } from "next";
import { Jost, Sacramento, Source_Sans_3 } from "next/font/google";
import { BrandDefs } from "@/components/site/Brand";
import { SITE } from "@/lib/site";
import "./globals.css";

const display = Jost({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  variable: "--font-display",
  display: "swap",
  fallback: ["Futura", "Century Gothic", "system-ui", "sans-serif"],
});
const sans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-sans",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});
const script = Sacramento({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
  fallback: ["Segoe Script", "cursive"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "AquaSail Watersports — boat trips and lagoon days in Mauritius",
    template: "%s · AquaSail Watersports",
  },
  description:
    "Catamaran days, undersea walks, parasailing, dolphin trips and private boat charters around Mauritius. Send an enquiry and we reply within one working day.",
  openGraph: {
    type: "website",
    siteName: "AquaSail Watersports",
    locale: "en_MU",
    images: [{ url: "/media/hero-le-morne.jpg", width: 1920, height: 1134 }],
  },
  twitter: { card: "summary_large_image" },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#12224A",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${script.variable}`}>
      <body>
        <BrandDefs />
        {children}
      </body>
    </html>
  );
}
