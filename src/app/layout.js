import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "aos/dist/aos.css";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/navbar/Navbar";
import PersistorProvider from "@/redux/Provider/PersistorProvider";
import Footer from "@/components/footer/Footer";
import AOSInitializer from "@/components/navbar/AOSInitializer";
import BackToTopButton from "@/components/footer/upArrow";
export const runtime = "edge";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "HSC Academic Achievement Program",
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
        {/* <script type="text/javascript">
          {`(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "t20d6nt0uc")`}
        </script> */}
      </body>
    </html>
  );
}
