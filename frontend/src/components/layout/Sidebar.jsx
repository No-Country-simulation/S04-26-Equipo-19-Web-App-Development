"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Navegación principal del MVP.
 *
 * Centralizamos los items para que la navegación sea fácil de mantener.
 * Si más adelante agregamos roles o nuevas vistas, se modifica este array
 * sin tocar la estructura principal del componente.
 */
const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    description: "Resumen operativo",
    tag: "Home",
  },
  {
    label: "Incidentes",
    href: "/incidents",
    description: "Listado y seguimiento",
    tag: "Flow",
  },
  {
    label: "Reportar incidente",
    href: "/incidents/new",
    description: "Formulario mobile-first",
    tag: "New",
    isAction: true,
  },
  {
    label: "Reportes",
    href: "/reports",
    description: "Causas y métricas",
    tag: "Data",
  },
];

/**
 * Determina qué item debe marcarse como activo.
 *
 * Casos especiales:
 * - /incidents/new pertenece a "Reportar incidente".
 * - /incidents y /incidents/[id] pertenecen a "Incidentes".
 *
 * Normalizamos la ruta para evitar errores con barras finales.
 */
function isNavItemActive(pathname, href) {
  const normalizedPathname = pathname.replace(/\/$/, "");

  if (href === "/dashboard") {
    return normalizedPathname === "/dashboard";
  }

  if (href === "/incidents/new") {
    return normalizedPathname === "/incidents/new";
  }

  if (href === "/incidents") {
    return (
      normalizedPathname === "/incidents" ||
      (normalizedPathname.startsWith("/incidents/") &&
        normalizedPathname !== "/incidents/new")
    );
  }

  if (href === "/reports") {
    return (
      normalizedPathname === "/reports" ||
      normalizedPathname.startsWith("/reports/")
    );
  }

  return normalizedPathname === href;
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 border-r border-[var(--border-muted)] bg-[var(--surface)] px-4 py-5 md:block">
      <div className="sticky top-5">
        {/* Brand / Producto */}
        <div className="rounded-[var(--radius-md)] border border-[var(--border-muted)] bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--brand-primary)] bg-[var(--brand-primary)] text-sm font-black text-white">
              OC
            </div>

            <div>
              <p className="text-sm font-black tracking-tight text-[var(--text-primary)]">
                OpsCore
              </p>

              <p className="mt-0.5 text-xs font-medium text-[var(--text-muted)]">
                Incident Management
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-[var(--radius-sm)] border border-[var(--border-muted)] bg-[var(--surface-soft)] px-3 py-2">
            <span className="size-2 rounded-sm bg-[var(--status-resolved)]" />

            <span className="text-xs font-bold text-[var(--text-secondary)]">
              MVP operativo
            </span>
          </div>
        </div>

        {/* Navegación */}
        <div className="mt-6">
          <p className="px-2 text-[0.68rem] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">
            Navegación
          </p>

          <nav className="mt-3 space-y-1.5" aria-label="Navegación principal">
            {navItems.map((item) => {
              const isActive = isNavItemActive(pathname, item.href);

              const activeBorderColor = item.isAction
                ? "border-[var(--safety-orange)]"
                : "border-[var(--brand-accent)]";

              const activeBarColor = item.isAction
                ? "bg-[var(--safety-orange)]"
                : "bg-[var(--brand-accent)]";

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`group relative block overflow-hidden rounded-[var(--radius-sm)] border px-3.5 py-3 transition duration-150 ${
                    isActive
                      ? `${activeBorderColor} bg-[var(--surface-muted)] text-[var(--text-primary)]`
                      : "border-transparent text-[var(--text-secondary)] hover:border-[var(--border-muted)] hover:bg-[var(--surface-soft)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {isActive && (
                    <span
                      className={`absolute inset-y-2 left-0 w-1 rounded-r-sm ${activeBarColor}`}
                    />
                  )}

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="block text-sm font-black tracking-tight">
                        {item.label}
                      </span>

                      <span
                        className={`mt-1 block text-xs leading-5 ${
                          isActive
                            ? "text-[var(--text-secondary)]"
                            : "text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]"
                        }`}
                      >
                        {item.description}
                      </span>
                    </div>

                    <span
                      className={`rounded-[var(--radius-xs)] border px-2 py-1 text-[0.62rem] font-black uppercase tracking-wide ${
                        isActive
                          ? item.isAction
                            ? "border-[rgba(232,93,4,0.28)] bg-[rgba(232,93,4,0.1)] text-[#a04003]"
                            : "border-[rgba(65,90,119,0.28)] bg-[rgba(65,90,119,0.1)] text-[#263d5c]"
                          : "border-[var(--border-muted)] bg-[var(--surface-soft)] text-[var(--text-muted)]"
                      }`}
                    >
                      {item.tag}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bloque contextual del sprint */}
        <div className="mt-7 rounded-[var(--radius-md)] border border-[var(--border-muted)] bg-[var(--surface-elevated)] p-4 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-black text-[var(--text-primary)]">
              Sprint 1
            </p>

            <span className="rounded-[var(--radius-xs)] border border-[rgba(65,90,119,0.28)] bg-[rgba(65,90,119,0.1)] px-2.5 py-1 text-[0.65rem] font-black uppercase tracking-wide text-[#263d5c]">
              Frontend
            </span>
          </div>

          <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
            Base visual, rutas principales, componentes compartidos y datos
            simulados para validar el flujo del MVP.
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-[var(--radius-sm)] border border-[var(--border-muted)] bg-[var(--surface-soft)] p-2 text-center">
              <p className="text-sm font-black text-[var(--text-primary)]">4</p>
              <p className="mt-1 text-[0.62rem] font-bold uppercase tracking-wide text-[var(--text-muted)]">
                Vistas
              </p>
            </div>

            <div className="rounded-[var(--radius-sm)] border border-[var(--border-muted)] bg-[var(--surface-soft)] p-2 text-center">
              <p className="text-sm font-black text-[var(--text-primary)]">
                Mock
              </p>
              <p className="mt-1 text-[0.62rem] font-bold uppercase tracking-wide text-[var(--text-muted)]">
                Data
              </p>
            </div>

            <div className="rounded-[var(--radius-sm)] border border-[var(--border-muted)] bg-[var(--surface-soft)] p-2 text-center">
              <p className="text-sm font-black text-[var(--text-primary)]">
                QA
              </p>
              <p className="mt-1 text-[0.62rem] font-bold uppercase tracking-wide text-[var(--text-muted)]">
                Ready
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}