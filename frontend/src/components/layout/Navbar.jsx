import Link from "next/link";

/**
 * Links principales visibles en mobile.
 *
 * En desktop la navegación principal vive en el Sidebar.
 * El Navbar queda como barra superior de contexto y acción rápida.
 */
const mobileLinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Incidentes",
    href: "/incidents",
  },
  {
    label: "Reportar",
    href: "/incidents/new",
  },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 h-16 border-b border-[var(--border-muted)] bg-[var(--surface)]">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo / nombre del producto */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--brand-primary)] bg-[var(--brand-primary)] font-black text-white">
            O
          </div>

          <div>
            <p className="text-sm font-black leading-none text-[var(--text-primary)]">
              OpsCore
            </p>

            <p className="mt-1 text-xs font-medium text-[var(--text-muted)]">
              Incident Management
            </p>
          </div>
        </Link>

        {/* Navegación compacta para pantallas chicas */}
        <nav className="flex items-center gap-1.5 md:hidden">
          {mobileLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-[var(--radius-sm)] px-2.5 py-2 text-xs font-bold text-[var(--text-secondary)] transition hover:bg-[var(--surface-soft)] hover:text-[var(--text-primary)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Acción principal visible en desktop */}
        <div className="hidden items-center gap-3 md:flex">
          <span className="rounded-[var(--radius-xs)] border border-[rgba(65,90,119,0.28)] bg-[rgba(65,90,119,0.1)] px-3 py-1 text-xs font-bold text-[#263d5c]">
            MVP Sprint 1
          </span>

          <Link
            href="/incidents/new"
            className="inline-flex min-h-10 items-center justify-center rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-200"
          >
            Nuevo incidente
          </Link>
        </div>
      </div>
    </header>
  );
}
