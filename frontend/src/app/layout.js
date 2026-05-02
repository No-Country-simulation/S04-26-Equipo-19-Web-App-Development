import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import "./globals.css";

// Fuente principal de la aplicación.
// Next optimiza estas fuentes automáticamente.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// Fuente monoespaciada.
// Puede servir más adelante para IDs técnicos, logs o códigos de incidentes.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata global del proyecto.
// Esto reemplaza los textos default de Create Next App.
export const metadata = {
  title: "OpsCore | Incident Management System",
  description:
    "Platform for reporting, tracking and analyzing operational incidents in industrial environments.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-950 text-slate-100">
        {/* 
          Navbar global.
          Se mantiene visible en todas las rutas principales del frontend.
        */}
        <Navbar />

        {/* 
          Layout principal de la aplicación.
          Sidebar queda a la izquierda en desktop y el contenido ocupa el resto.
        */}
        <div className="flex min-h-[calc(100vh-64px)]">
          <Sidebar />

          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}