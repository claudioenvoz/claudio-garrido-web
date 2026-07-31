# Arquitectura del Sistema de Reservas — Etapa 2 (Flujo Interno)
**Estado:** Propuesta para validación. Sin implementación todavía.

Alcance de esta etapa: modelo de datos, estados, rutas de API y estructura de carpetas para que una reserva pueda crearse y gestionarse internamente. **Sin** Cal.com, Google Calendar, Ionix ni emails automáticos todavía — pero con los puntos de conexión para esas cuatro piezas ya definidos como interfaces, para no tener que rediseñar nada cuando las conectemos.

---

## 1. Modelo de datos de una Reserva

```typescript
type Reserva = {
  id: string;                    // uuid generado al crear la reserva

  // Servicio y plan
  servicio: "canto" | "piano" | "piano-funcional" | "masterclass";
  planId: string;                 // ej. "individual" | "mensual" | "bimensual"
  planNombre: string;              // copia del nombre al momento de reservar
  planPrecio: string;              // copia del precio al momento de reservar
                                    // (si el precio cambia después, esta reserva
                                    // conserva el precio con el que se pagó)

  // Fecha y hora
  fecha: string;                   // "2026-08-14" (ISO date)
  hora: string;                    // "10:00"
  duracionMinutos: number;

  // Datos del alumno
  nombre: string;
  email: string;
  whatsapp: string;
  pais: string;
  comentarios?: string;

  // Pago
  metodoPago: "transferencia_chile" | "ionix_internacional" | null;
  comprobanteUrl?: string;         // solo transferencia_chile
  pagoExternoId?: string;          // solo ionix_internacional (referencia del proveedor)

  // Estado
  estado: EstadoReserva;
  holdExpiraEn: string | null;     // timestamp ISO — vence el hold si no hay pago

  // Integraciones futuras (null hasta que existan)
  googleCalendarEventId: string | null;

  // Metadata
  origen: string;                  // qué botón/página generó la reserva (analítica)
  notasInternas?: string;          // notas que Claudio agrega desde el panel
  creadoEn: string;
  actualizadoEn: string;
};
```

**Por qué se copian `planNombre` y `planPrecio`** en vez de solo guardar `planId`: si más adelante cambias un precio en Sanity, las reservas ya hechas no deben cambiar de precio retroactivamente. Es una reserva de lo que la persona efectivamente aceptó pagar.

### Campos obligatorios vs. opcionales

| Campo | Obligatorio | Se completa en |
|---|---|---|
| `servicio`, `planId`, `fecha`, `hora` | Sí | Pasos 1-3 del wizard |
| `nombre`, `email`, `whatsapp`, `pais` | Sí | Paso 4 |
| `comentarios` | No | Paso 4 |
| `metodoPago` | Sí, antes de confirmar | Paso 5 / pantalla de pago |
| `comprobanteUrl` | Solo si `metodoPago = transferencia_chile` | Después del paso 5 |
| `pagoExternoId` | Solo si `metodoPago = ionix_internacional` | Vía webhook (futuro) |

---

## 2. Estados posibles (`EstadoReserva`)

```typescript
type EstadoReserva =
  | "pendiente_pago"       // creada, esperando que el alumno pague o suba comprobante
  | "pendiente_revision"    // (solo Chile) comprobante subido, esperando aprobación manual
  | "confirmada"            // pago verificado — el horario queda bloqueado en firme
  | "rechazada"             // comprobante rechazado por Claudio
  | "cancelada"             // cancelada (por el alumno o por Claudio)
  | "reagendada"            // se movió a otra fecha/hora (ver nota abajo)
  | "expirada"              // el hold venció sin pago — el horario se liberó solo
  | "completada";           // la clase ya se realizó (para historial/estadísticas)
```

**Transiciones válidas** (para que el panel de administración y la API rechacen cambios de estado sin sentido):

```
pendiente_pago  ─┬─→ pendiente_revision   (Chile: sube comprobante)
                 ├─→ confirmada           (Ionix: webhook confirma pago)
                 └─→ expirada             (venció el hold sin acción)

pendiente_revision ─┬─→ confirmada        (Claudio aprueba)
                     └─→ rechazada        (Claudio rechaza)

confirmada ─┬─→ reagendada
            ├─→ cancelada
            └─→ completada                (automático, pasada la fecha/hora)
```

**Sobre "reagendada":** no se sobrescribe la reserva original. Se crea una reserva nueva con `fecha`/`hora` distintas, y la original pasa a `estado: "reagendada"` con un campo adicional `reagendadaHaciaId` apuntando a la nueva. Esto preserva el historial completo en vez de perder el rastro de que hubo un cambio.

---

## 3. Estructura de carpetas (Next.js App Router)

```
app/
├── servicios/canto/reserva/
│   └── page.tsx                  # Frontend del wizard (ya existe, Etapa 1)
│
└── api/
    └── reservas/
        ├── route.ts               # POST crear reserva · GET listar (admin)
        └── [id]/
            ├── route.ts           # GET una reserva · PATCH cambiar estado
            └── comprobante/
                └── route.ts       # POST subir comprobante de transferencia

lib/
├── reservas/
│   ├── types.ts                   # Reserva, EstadoReserva, tipos compartidos
│   ├── validar.ts                 # validación de input (ej. con zod)
│   ├── crearReserva.ts            # lógica: valida, revisa disponibilidad, crea hold
│   ├── cambiarEstado.ts           # lógica: valida transición de estado y la aplica
│   └── repositorio.ts             # acceso a datos — ÚNICO lugar que sabe "dónde
│                                    se guarda". Hoy: memoria/archivo. Mañana: Supabase.
│
└── integraciones/
    ├── calendario/
    │   └── index.ts               # interfaz CalendarProvider + stub actual
    ├── pagos/
    │   └── index.ts               # interfaz PaymentProvider + stub actual
    └── email/
        └── index.ts               # interfaz EmailProvider + stub actual (console.log)
```

**Principio detrás de esta separación:** el `page.tsx` del wizard nunca sabe cómo se guarda una reserva ni cómo se revisa disponibilidad — solo hace `fetch("/api/reservas", { method: "POST", body })`. La ruta de API (`route.ts`) tampoco contiene lógica de negocio — solo recibe la petición, la pasa a `lib/reservas/crearReserva.ts`, y devuelve la respuesta. Toda la lógica real vive en `lib/`, que es código plano de TypeScript, fácil de probar y de mover si el día de mañana cambia el framework.

---

## 4. Ruta de API recomendada para crear una reserva

**`POST /api/reservas`**

Request:
```json
{
  "servicio": "canto",
  "planId": "mensual",
  "fecha": "2026-08-14",
  "hora": "10:00",
  "nombre": "...",
  "email": "...",
  "whatsapp": "...",
  "pais": "...",
  "comentarios": "...",
  "origen": "hero-canto"
}
```

Response (201):
```json
{
  "id": "res_8f2a...",
  "estado": "pendiente_pago",
  "holdExpiraEn": "2026-08-14T23:59:00-04:00"
}
```

Lógica interna de `crearReserva.ts` (descrita, no implementada todavía):
1. Validar el body (todos los campos obligatorios, formato de fecha/hora válido).
2. Consultar disponibilidad vía `CalendarProvider.estaDisponible(fecha, hora)` — hoy el stub siempre responde `true`; cuando conectemos Cal.com, esta única función es la que cambia.
3. Calcular `holdExpiraEn` según el plan de negocio ya definido (23:59 del mismo día para transferencia — el método de pago se define en el paso siguiente, así que el hold se calcula de forma conservadora desde el inicio).
4. Guardar la reserva vía `repositorio.crear(reserva)` con `estado: "pendiente_pago"`.
5. Devolver `id` y `holdExpiraEn` al frontend.

**Otras rutas necesarias para el flujo completo:**

| Ruta | Método | Propósito |
|---|---|---|
| `/api/reservas/[id]` | `GET` | Consultar el estado actual de una reserva (para que el frontend haga polling o muestre confirmación) |
| `/api/reservas/[id]` | `PATCH` | Cambiar de estado (usado por el panel de administración: aprobar, rechazar, cancelar) |
| `/api/reservas/[id]/comprobante` | `POST` | Subir el archivo de comprobante de transferencia (Chile) — pasa la reserva a `pendiente_revision` |
| `/api/reservas` | `GET` | Listar reservas (protegido — uso exclusivo del futuro Panel de Administración) |

---

## 5. Separación Frontend / Backend

```
┌─────────────────────┐        fetch("/api/reservas")        ┌──────────────────────┐
│   Wizard (cliente)   │ ────────────────────────────────────▶ │  Route Handler (API)  │
│   page.tsx            │                                       │  app/api/reservas/... │
│   - estado del form   │ ◀──────────────────────────────────── │  - parsea el request  │
│   - validación visual │        { id, estado, holdExpiraEn }   │  - llama a lib/       │
└─────────────────────┘                                       └──────────┬───────────┘
                                                                           │
                                                                           ▼
                                                              ┌─────────────────────────┐
                                                              │   lib/reservas/*.ts      │
                                                              │  (lógica de negocio,      │
                                                              │   sin saber que es HTTP)  │
                                                              └──────────┬───────────────┘
                                                                          │
                                              ┌───────────────────────────┼───────────────────────────┐
                                              ▼                           ▼                           ▼
                                   lib/reservas/repositorio.ts  lib/integraciones/calendario   lib/integraciones/pagos
                                   (guarda/lee la reserva)      (disponibilidad — stub hoy)     (link de pago — stub hoy)
```

El frontend **nunca** importa nada de `lib/reservas` ni `lib/integraciones` directamente — solo conoce la API HTTP. Esto es lo que permite, más adelante, mover el backend a otro servicio si hiciera falta, sin tocar el wizard.

---

## 6. Preparación para las integraciones futuras

La idea central: **cada integración futura es una implementación de una interfaz que ya queda definida ahora**, con un stub (versión falsa) que permite que todo el flujo funcione de punta a punta sin la pieza real todavía.

```typescript
// lib/integraciones/calendario/index.ts

interface CalendarProvider {
  estaDisponible(fecha: string, hora: string): Promise<boolean>;
  crearEvento(reserva: Reserva): Promise<{ eventId: string }>;
  cancelarEvento(eventId: string): Promise<void>;
}

// Implementación actual: siempre disponible, no crea nada real todavía.
// El día que conectemos Cal.com, se reemplaza SOLO este archivo.
const calendarProviderStub: CalendarProvider = {
  async estaDisponible() { return true; },
  async crearEvento() { return { eventId: "stub-" + Date.now() }; },
  async cancelarEvento() {},
};
```

```typescript
// lib/integraciones/pagos/index.ts

interface PaymentProvider {
  crearLinkDePago(reserva: Reserva): Promise<{ url: string } | null>;
  // null = este método de pago no genera link (ej. transferencia manual)
}

// Hoy: transferencia_chile no genera link (se resuelve con comprobante subido).
// ionix_internacional sí generará un link real — por ahora, stub.
```

```typescript
// lib/integraciones/email/index.ts

interface EmailProvider {
  enviarConfirmacionAlumno(reserva: Reserva): Promise<void>;
  enviarNotificacionClaudio(reserva: Reserva): Promise<void>;
}

// Stub actual: solo hace console.log — no envía nada real todavía.
```

**Qué cambia cuando conectemos cada pieza real, y qué NO cambia:**

| Integración | Archivo que cambia | Archivos que NO cambian |
|---|---|---|
| Cal.com / Google Calendar | `lib/integraciones/calendario/index.ts` | wizard, rutas de API, modelo de datos |
| Ionix Payments | `lib/integraciones/pagos/index.ts` + 1 webhook nuevo (`/api/webhooks/ionix`) | wizard, resto de rutas |
| Correos automáticos | `lib/integraciones/email/index.ts` | todo lo demás |
| Base de datos real (Supabase) | `lib/reservas/repositorio.ts` | toda la lógica de negocio en `crearReserva.ts` / `cambiarEstado.ts` |

---

## 7. Lo que esta etapa entrega vs. lo que sigue pendiente

**Entrega esta etapa (Etapa 2, una vez la apruebes):**
- Modelo de datos y estados funcionando de extremo a extremo
- API real que crea y consulta reservas
- Repositorio de datos simple (en memoria o archivo local — **no Supabase todavía**, para no adelantar esa decisión sin conectar antes el resto del flujo)
- Los 3 stubs de integración, para que el flujo completo (crear reserva → cambiar estado → "enviar confirmación") corra sin errores aunque nada sea real todavía

**Sigue pendiente para etapas futuras:**
- Reemplazar el repositorio en memoria por Supabase (persistencia real entre reinicios del servidor)
- Reemplazar los 3 stubs por Cal.com, Ionix y un proveedor de email real
- Panel de Administración que consuma `GET /api/reservas` y `PATCH /api/reservas/[id]`

---

## Preguntas para validar antes de programar

1. ¿El modelo de datos y los 8 estados te hacen sentido, o quieres agregar/quitar alguno?
2. ¿Repositorio en memoria/archivo para esta etapa te parece bien, o prefieres saltar directo a Supabase aunque las otras integraciones sigan siendo stubs?
3. ¿Las rutas de API propuestas cubren todo lo que necesitas, o falta alguna (ej. cancelar reserva desde el propio alumno, no solo desde el panel)?
