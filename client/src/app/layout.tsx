import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Contract Management System",
  description: "A mini contract management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen bg-background">
            <header className="border-b">
              <div className="container mx-auto py-4">
                <h1 className="text-2xl font-bold">
                  Contract Management System
                </h1>
              </div>
            </header>
            <main className="container mx-auto py-8 flex-grow">{children}</main>
            <footer className="border-t mt-auto my-10">
              <div className="container mx-auto py-4 text-center text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Contract Management System
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
