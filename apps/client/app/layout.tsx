import type { Metadata, Viewport } from "next";
import { Analytics } from "@/components/analytics";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  BASE_CLIENT_URL,
  NAME,
  PORTFOLIO_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
} from "@/lib/constants";

import "./globals.css";

// export const runtime = 'edge';
import { DM_Mono, DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  referrer: "origin-when-cross-origin",
  keywords:
    "codex, code collaboration, real-time coding, pair programming, remote collaboration, live coding, code sharing, collaborative editor, monaco editor, cursor sharing, live preview, video chat, collaborative terminal, shared terminal, code execution, GitHub integration, web IDE, online IDE, collaborative development, coding platform, programming tools",
  creator: NAME,
  publisher: NAME,
  authors: {
    name: NAME,
    url: PORTFOLIO_URL,
  },
  metadataBase: new URL(BASE_CLIENT_URL),
  formatDetection: {
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: BASE_CLIENT_URL,
  },
  twitter: {
    card: "summary_large_image",
    creator: "@bhasidhshaik",
  },
  alternates: {
    canonical: BASE_CLIENT_URL,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  userScalable: false,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      className={`${dmSans.variable} ${dmMono.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <meta name="darkreader-lock" />
      </head>
      <body className="h-dvh text-pretty antialiased">
        <Analytics />
        <ThemeProvider attribute="class" disableTransitionOnChange>
          <TooltipProvider>{children}</TooltipProvider>
          <Toaster
            className="whitespace-pre-line"
            containerAriaLabel="Toast Notifications"
            pauseWhenPageIsHidden
            richColors
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
