import type { Metadata } from "next";
import "./globals.css";
import { AppUtilsProvider } from "@/context/AppUtils";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Basic CRUD App using Next.js + Supabase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppUtilsProvider>
          <Toaster />
          {children}
        </AppUtilsProvider>
      </body>
    </html>
  );
}
