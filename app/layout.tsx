import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "FORZA İnternet & Cafe — Şehrin 1 Numaralı Espor ve Gaming Alanı",
    template: "%s | FORZA İnternet & Cafe",
  },
  description: "En yeni nesil RTX 40 serisi bilgisayarlar, 540 Hz espor monitörleri, özel turnuva masaları ve konforlu alanıyla Forza İnternet Cafe'ye hoş geldiniz.",
  keywords: ["forza internet cafe", "espor kafe", "540hz monitör", "gaming cafe", "rtx 4090 internet kafe"],
  authors: [{ name: "Forza Gaming" }],
  icons: {
    icon: "/forzaikon.jpeg",
    apple: "/forzaikon.jpeg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#07090d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Sora:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}