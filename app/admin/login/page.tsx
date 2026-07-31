"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { crearClienteNavegador } from "@/lib/supabase/cliente";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  async function iniciarSesion(e: React.FormEvent) {
    e.preventDefault();
    setCargando(true);
    setError(null);

    const supabase = crearClienteNavegador();
    const { error: errorLogin } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (errorLogin) {
      setError("Email o contraseña incorrectos.");
      setCargando(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl md:text-3xl font-medium text-neutral-900 mb-2 text-center">
          Panel de Administración
        </h1>
        <p className="text-sm text-neutral-500 mb-10 text-center">
          Inicia sesión para continuar.
        </p>

        <form onSubmit={iniciarSesion} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full rounded-xl border border-neutral-300 px-4 py-3
                text-base text-neutral-900
                transition-colors duration-200
                focus:outline-none focus:border-neutral-900
              "
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full rounded-xl border border-neutral-300 px-4 py-3
                text-base text-neutral-900
                transition-colors duration-200
                focus:outline-none focus:border-neutral-900
              "
            />
          </div>

          {error && (
            <p className="text-sm text-neutral-600 bg-neutral-50 border border-neutral-200 rounded-xl p-4">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="
              w-full inline-flex items-center justify-center
              bg-neutral-900 text-white
              px-7 py-3.5
              text-base font-medium
              rounded-full
              transition-colors duration-200
              hover:bg-neutral-800
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-neutral-900
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900
              mt-2
            "
          >
            {cargando ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </main>
  );
}
