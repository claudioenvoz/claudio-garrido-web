"use client";

import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { label: "Inicio", href: "/#inicio" },
  { label: "Sobre mí", href: "/#sobre-mi" },
  { label: "Servicios", href: "/#servicios" },
  { label: "Piano Funcional", href: "/#piano-funcional" },
  { label: "Contacto", href: "/#contacto" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const cerrarMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-neutral-200">
      <div className="mx-auto max-w-7xl px-6 md:px-10 h-20 flex items-center justify-between">

        <Link
          href="/#inicio"
          onClick={cerrarMenu}
          className="text-base font-medium text-neutral-900 transition-opacity duration-200 hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 rounded-sm"
        >
          Claudio En Voz
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-neutral-700 transition-colors duration-200 hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 rounded-sm"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/reservar"
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
                  onClick={cerrarMenu}
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
