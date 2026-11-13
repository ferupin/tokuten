import { siteUrl } from "@/config";
import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { I18nProvider } from "@/i18n";
import "@fontsource/dela-gothic-one/400.css";
import "@fontsource/dela-gothic-one/japanese-400.css";
import "@fontsource/shippori-mincho/600.css";
import "@fontsource/shippori-mincho/800.css";
import "@fontsource/shippori-mincho/japanese-800.css";
import "@fontsource/zen-kaku-gothic-new/400.css";
import "@fontsource/zen-kaku-gothic-new/500.css";
import "@fontsource/zen-kaku-gothic-new/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/700.css";
import "./globals.css";


export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Tokuten 特点",
  description: "A consistent way to score a tokusatsu season, built on the Kijun method.",
  openGraph: {
    title: "Tokuten 特点",
    description: "A consistent way to score a tokusatsu season, built on the Kijun method.",
    type: "website",
    siteName: "Tokuten",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3ecdc" },
    { media: "(prefers-color-scheme: dark)", color: "#16130e" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <I18nProvider>{children}</I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
