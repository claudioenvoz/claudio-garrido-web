const navLinks = [
  { label: "Inicio", href: "#inicio" },
  { label: "Sobre mí", href: "#sobre-mi" },
  { label: "Servicios", href: "#servicios" },
  { label: "Piano Funcional", href: "#piano-funcional" },
  { label: "Contacto", href: "#contacto" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-neutral-200">
      <div className="mx-auto max-w-7xl px-6 md:px-10 h-20 flex items-center justify-between">
        <a
          href="#inicio"
          className="text-base font-medium text-neutral-900 transition-opacity duration-200 hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 rounded-sm"
        >
          Claudio En Voz
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-neutral-700 transition-colors duration-200 hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 rounded-sm"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="
            hidden md:inline-flex
            bg-neutral-900 text-white
            px-6 py-3
            text-sm font-medium
            rounded-full
            transition-colors duration-200
            hover:bg-neutral-800
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900
          "
        >
          Reservar una clase
        </button>

        <button
          type="button"
          aria-label="Abrir menú"
          className="md:hidden flex flex-col items-end gap-1.5 p-2 transition-opacity duration-200 hover:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 rounded-sm"
        >
          <span className="block w-6 h-px bg-neutral-900" />
          <span className="block w-6 h-px bg-neutral-900" />
          <span className="block w-6 h-px bg-neutral-900" />
        </button>
      </div>
    </header>
  );
}
