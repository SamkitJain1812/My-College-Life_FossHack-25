import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AppShell } from "@/components/app-shell";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const deploymentHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;

export const metadata: Metadata = {
  metadataBase: new URL(deploymentHost ? `https://${deploymentHost}` : "http://localhost:3000"),
  title: {
    default: "My College Life | AI Student Companion",
    template: "%s | My College Life",
  },
  description: "Your all-in-one AI student companion for academics, tasks, finance, travel, and your portfolio.",
  applicationName: "My College Life",
  generator: "Next.js",
  keywords: ["college life", "student companion", "study assistant", "travel planner", "finance tracker"],
  authors: [{ name: "My College Life Contributors" }],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    siteName: "My College Life",
    title: "My College Life | AI Student Companion",
    description: "Plan, learn, organize, and grow with one student-focused companion.",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "My College Life AI student companion" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "My College Life | AI Student Companion",
    description: "Plan, learn, organize, and grow with one student-focused companion.",
    images: ["/og-image.svg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={fontSans.variable}>
      <body className="font-sans min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
