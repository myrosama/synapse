import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import { ThemeProvider } from "@/lib/theme";

export const metadata: Metadata = {
  title: "Recito - Learn English by Teaching It Back",
  description: "AI-powered English learning platform using role-swap teach-back methodology. Learn a micro-lesson, then teach it back to the AI and get scored, corrected, and guided.",
  keywords: ["English learning", "AI tutor", "teach-back", "language learning", "IELTS", "grammar"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ThemeProvider>
          <AppProvider>
            {children}
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

