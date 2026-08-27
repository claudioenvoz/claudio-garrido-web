"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type MouseEvent, useState } from "react";

const navLinks = [
  { label: "Inicio", href: "/#inicio" },
  { label: "Sobre mí", href: "/#sobre-mi" },
  { label: "Servicios", href: "/#servicios" },
  { label: "Piano Funcional", href: "/#piano-funcional" },
  { label: "Contacto", href: "/#contacto" },
];

const controlledHomeAnchors = new Set([
  "sobre-mi",
  "servicios",
  "piano-funcional",
]);

const BOTTOM_GAP = 8;
const HEADER_GAP = 8;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  const cerrarMenu = () => {
    setMenuOpen(false);
  };

  const navegarASeccion = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    const anchorId = href.startsWith("/#") ? href.slice(2) : "";

    if (!isHome || !controlledHomeAnchors.has(anchorId)) {
      cerrarMenu();
      return;
    }

    event.preventDefault();

    const posicionarDestino = () => {
      const target = document.getElementById(anchorId);
      const header = document.querySelector("header");

      if (!target || !header) return;

      const rect = target.getBoundingClientRect();
      const headerHeight = header.getBoundingClientRect().height;
      const minimumTop = headerHeight + HEADER_GAP;
      const bottomAlignedTop = window.innerHeight - BOTTOM_GAP - rect.height;
      const finalTop = Math.max(minimumTop, bottomAlignedTop);
      const absoluteTop = rect.top + window.scrollY;
      const pianoBottomAdjustment = anchorId === "piano-funcional" ? 120 : 0;
      const targetY = absoluteTop - finalTop + pianoBottomAdjustment;

      window.history.pushState(null, "", `#${anchorId}`);
      window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
    };

    if (menuOpen) {
      cerrarMenu();
      requestAnimationFrame(() => requestAnimationFrame(posicionarDestino));
      return;
    }

    posicionarDestino();
  };

  return (
    <header className={`sticky top-0 z-50 w-full bg-white border-b border-neutral-200 ${isHome ? "bg-white/95 backdrop-blur-md" : ""}`}>
      <div className={`mx-auto max-w-7xl px-6 md:px-10 flex items-center justify-between ${isHome ? "h-[72px] md:h-20" : "h-20"}`}>

        <Link
          href="/#inicio"
          onClick={cerrarMenu}
          className={`font-medium text-neutral-900 transition-opacity duration-200 hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 rounded-sm ${isHome ? "text-lg tracking-[-0.02em]" : "text-base"}`}
        >
          Claudio En Voz
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={(event) => navegarASeccion(event, link.href)}
              className={`text-sm font-medium transition-colors duration-200 hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 rounded-sm ${isHome ? "text-neutral-600" : "text-neutral-700"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/reservar"
          className={`
            hidden md:inline-flex
            bg-neutral-900 text-white
            px-6 py-3
            text-sm font-medium
            ${isHome ? "rounded-lg" : "rounded-full"}
            transition-colors duration-200
            hover:bg-neutral-800
            focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900
          `}
        >
          Reservar una clase
        </Link>

        <button
          type="button"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="md:hidden flex flex-col items-end gap-1.5 p-2 transition-opacity duration-200 hover:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 rounded-sm"
        >
          <span className="block w-6 h-px bg-neutral-900" />
          <span className="block w-6 h-px bg-neutral-900" />
          <span className="block w-6 h-px bg-neutral-900" />
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white">
          <nav className="mx-auto max-w-7xl px-6 py-5">
            <div className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={(event) => navegarASeccion(event, link.href)}
                  className="py-3 text-base font-medium text-neutral-700 transition-colors duration-200 hover:text-neutral-900"
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/reservar"
                onClick={cerrarMenu}
                className="
                  mt-3
                  inline-flex justify-center
                  bg-neutral-900 text-white
                  px-6 py-3
                  text-sm font-medium
                  rounded-full
                  transition-colors duration-200
                  hover:bg-neutral-800
                "
              >
                Reservar una clase
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
