import "./globals.css";
import { IBM_Plex_Mono } from "next/font/google";
import { CursorFX } from "@/components/ui/cursor-fx";

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${mono.variable} min-h-screen antialiased`}>
        <CursorFX />
        {children}
      </body>
    </html>
  );
}