import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://voluntariosve.org";
const TITLE = "Venezuela Se Levanta - Red de Voluntarios";
const DESCRIPTION =
  "Conectamos profesionales voluntarios del mundo con venezolanos afectados por el terremoto. Psicólogos, médicos, ingenieros y más ofrecen ayuda 100% gratuita.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "Venezuela Se Levanta",
    locale: "es_VE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full flex flex-col bg-white text-gray-900">{children}</body>
    </html>
  );
}
