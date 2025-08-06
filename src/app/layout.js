import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "aos/dist/aos.css";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/navbar/Navbar";
import PersistorProvider from "@/redux/Provider/PersistorProvider";
import Footer from "@/components/footer/Footer";
import AOSInitializer from "@/components/navbar/AOSInitializer";
import BackToTopButton from "@/components/footer/upArrow";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ACS Varsity + GST Special Private Programme 2025 ",
  description: "Apar's Classroom 2025",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/image.png" type="image/png" />
      </head>
      <body
        className={`min-h-screen flex flex-col overflow-x-hidden ${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <PersistorProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AOSInitializer />
            <div className="container mx-auto overflow-hidden w-full">
              <Navbar />
            </div>
            <main className="flex-grow ">
              <div className="mx-auto  md:min-h-screen my-5 md:my-0">
                {children}
              </div>
            </main>
            <Footer />
            <BackToTopButton />
          </ThemeProvider>
        </PersistorProvider>
      </body>
    </html>
  );
}
