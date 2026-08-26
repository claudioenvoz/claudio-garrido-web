import Link from "next/link";

export default function ResultadoIonixPage({
  searchParams,
}: {
  searchParams: { resultado?: string };
}) {
  const fallo = searchParams.resultado === "failure";

  return (
    <main className="w-full min-h-[calc(100vh-80px)] flex items-center justify-center px-6">
      <section className="w-full max-w-lg rounded-2xl border border-neutral-200 p-8 text-center">
        <h1 className="text-2xl font-medium text-neutral-900 mb-3">
          {fallo ? "El pago no se completó" : "Estamos validando tu pago"}
        </h1>
        <p className="text-neutral-600 leading-relaxed">
          {fallo
            ? "No hemos confirmado tu reserva. Puedes volver a intentarlo desde la página de reserva."
            : "Ionix está validando la transacción. Confirmaremos tu reserva cuando recibamos la confirmación oficial de pago."}
        </p>
        <Link
          href="/"
          className="inline-flex mt-7 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white"
        >
          Volver al inicio
        </Link>
      </section>
    </main>
  );
}
