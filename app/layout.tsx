import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Venezuela Se Levanta - Red de Voluntarios",
  description:
    "Conectamos profesionales voluntarios del mundo con venezolanos afectados por el terremoto. Psicólogos, médicos, ingenieros y más ofrecen ayuda gratuita.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className="min-h-full flex flex-col bg-white text-gray-900">{children}</body>
    </html>
  );
}
