"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Configuración centralizada de navegación.
// Si mañana agregamos nuevas secciones, se suman acá y listo.
const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    description: "Resumen operativo",
  },
  {
    label: "Incidentes",
    href: "/incidents",
    description: "Listado y seguimiento",
  },
  {
    label: "Reportar incidente",
    href: "/incidents/new",
    description: "Formulario mobile-first",
  },
  {
    label: "Reportes",
    href: "/reports",
    description: "Causas y métricas",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-slate-950 px-4 py-6 md:block">
      <div className="sticky top-24">
        <p className="px-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Navegación
        </p>

        <nav className="mt-4 space-y-2">
          {navItems.map((item) => {
            // Marcamos como activo solo el link que coincide exactamente con la ruta actual.
            // Evita que /incidents también quede activo cuando estamos en /incidents/new.
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-2xl border px-4 py-3 transition ${
                  isActive
                    ? "border-cyan-400/30 bg-cyan-400/10 text-white"
                    : "border-transparent text-slate-400 hover:border-white/10 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="block text-sm font-semibold">
                  {item.label}
                </span>

                <span className="mt-1 block text-xs text-slate-500">
                  {item.description}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bloque contextual del MVP */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-sm font-semibold text-white">Sprint 1</p>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Base frontend en Next.js con rutas iniciales, componentes
            compartidos y datos simulados.
          </p>
        </div>
      </div>
    </aside>
  );
}
