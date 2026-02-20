import Link from "next/link";

const items = [
  { label: "About", href: "/about" },
  { label: "Experience", href: "/experience" },
  { label: "Projects", href: "/projects" },
  { label: "Certifications", href: "/certifications" },
  { label: "Research", href: "/research" },
];

export function Sidebar({ show }: { show: boolean }) {
  return (
    <>
      {/* Optional dim backdrop */}
      <div
        className={[
          "fixed inset-0 z-40 hidden md:block transition-opacity duration-500",
          show ? "opacity-0 backdrop-blur-sm" : "opacity-0 pointer-events-none",
        ].join(" ")}
        style={{ background: "black" }}
      />

      <aside
        className={[
          "fixed left-0 top-0 z-50 hidden md:block",
          "h-screen w-80",
          "transition-all duration-700 ease-out",
          show ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10 pointer-events-none",
        ].join(" ")}
      >
        {/* Spacer to push menu down like your screenshot */}
        <div className="h-56" />

        <nav className="pl-16 space-y-12 text-xl">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="block text-[rgb(var(--fg))] hover:opacity-80 transition"
            >
              {it.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
