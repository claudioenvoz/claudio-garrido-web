import type { Metadata } from "next";
import { Fraunces, Work_Sans, IBM_Plex_Mono } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://claudiogarrido.com"),
  title: "Claudio Garrido | Clases de Piano y Canto",
  description:
    "Clases de piano y canto online y presenciales, con un enfoque personalizado para aprender música de forma práctica, cercana y a tu propio ritmo.",
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: "https://claudiogarrido.com",
    siteName: "Claudio Garrido",
    title: "Claudio Garrido | Clases de Piano y Canto",
    description:
      "Clases de piano y canto online y presenciales, con un enfoque personalizado para aprender música de forma práctica, cercana y a tu propio ritmo.",
    images: [
      {
        url: "/images/hero.jpg",
        width: 1440,
        height: 1080,
        alt: "Claudio Garrido",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Claudio Garrido | Clases de Piano y Canto",
    description:
      "Clases de piano y canto online y presenciales, con un enfoque personalizado para aprender música de forma práctica, cercana y a tu propio ritmo.",
    images: ["/images/hero.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${fraunces.variable} ${workSans.variable} ${plexMono.variable} font-body`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
