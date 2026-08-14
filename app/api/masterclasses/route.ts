import { NextRequest, NextResponse } from "next/server";
import { supabaseServidor } from "@/lib/supabase/servidor";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

    const whatsapp =
      typeof body.whatsapp === "string" ? body.whatsapp.trim() : null;

    if (!email) {
      return NextResponse.json(
        { error: "El correo electrónico es obligatorio." },
        { status: 400 }
      );
    }

    const { error } = await supabaseServidor
      .from("masterclass_inscripciones")
      .insert({
        email,
        whatsapp: whatsapp || null,
      });

    if (error) {
      console.error("[Masterclasses] Error al guardar inscripción:", error);

      return NextResponse.json(
        { error: "No fue posible registrar la inscripción." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { mensaje: "Inscripción registrada correctamente." },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Masterclasses] Error inesperado:", error);

    return NextResponse.json(
      { error: "Ocurrió un error al procesar la inscripción." },
      { status: 500 }
    );
  }
}