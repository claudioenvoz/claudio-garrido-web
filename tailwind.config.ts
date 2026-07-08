import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta de marca — Claudio Garrido / Piano Funcional
        nogal: "#2A2019",      // fondo principal, cálido y profundo
        marfil: "#F2E9DC",     // texto principal sobre fondo oscuro
        bronce: "#B8935A",     // acento — herrajes de piano
        burdeos: "#7A3B36",    // acento secundario — fieltro de martillos
        crema: "#FBF8F2",      // fondo alterno claro (secciones invertidas)
        tinta: "#211812",      // texto sobre fondo claro
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
