import Link from "next/link";

const footerLinks = [
  { label: "Sobre mí", href: "/#sobre-mi" },
  { label: "Servicios", href: "/#servicios" },
  { label: "Piano Funcional", href: "/#piano-funcional" },
  { label: "Preguntas frecuentes", href: "/#faq" },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-14 md:py-20 flex flex-col md:flex-row md:items-start md:justify-between gap-10">
        <div className="max-w-sm">
          <Link href="/#inicio" className="text-lg font-semibold tracking-[-0.02em] text-neutral-950 hover:opacity-70 transition-opacity">
            Claudio En Voz
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-neutral-500">
            Clases de canto, piano y formación musical con acompañamiento profesional y personalizado.
          </p>
        </div>

        <nav aria-label="Navegación del pie de página" className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-neutral-600 transition-colors hover:text-neutral-950">
              {link.label}
            </Link>
          ))}
          <Link href="/reservar" className="text-sm font-semibold text-neutral-950 transition-colors hover:text-yellow-700">
            Reservar una clase
          </Link>
        </nav>
      </div>
    </footer>
  );
}
