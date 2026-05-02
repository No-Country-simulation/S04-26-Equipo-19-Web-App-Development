import Link from "next/link";

// Links principales visibles en mobile.
// En desktop la navegación fuerte vive en el Sidebar.
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
    <header className="sticky top-0 z-50 h-16 border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo / nombre del producto */}
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400 font-bold text-slate-950">
            O
          </div>

          <div>
            <p className="text-sm font-semibold leading-none text-white">
              OpsCore
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Incident Management
            </p>
          </div>
        </Link>

        {/* Navegación compacta para pantallas chicas */}
        <nav className="flex items-center gap-2 md:hidden">
          {mobileLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Acción secundaria visible en desktop */}
        <div className="hidden items-center gap-3 md:flex">
          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
            MVP Sprint 1
          </span>

          <Link
            href="/incidents/new"
            className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Nuevo incidente
          </Link>
        </div>
      </div>
    </header>
  );
}