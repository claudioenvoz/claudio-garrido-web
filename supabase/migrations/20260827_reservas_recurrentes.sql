create table if not exists public.reserva_clases (
  id uuid primary key default gen_random_uuid(),
  reserva_id uuid not null references public.reservas(id) on delete cascade,
  numero_clase integer not null check (numero_clase > 0),
  fecha date not null,
  hora time without time zone not null,
  duracion_minutos integer not null check (duracion_minutos > 0),
  google_calendar_event_id text,
  estado_sincronizacion text not null default 'pendiente'
    check (estado_sincronizacion in ('pendiente', 'creando', 'creado', 'error', 'cancelado')),
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now(),
  constraint reserva_clases_numero_unico unique (reserva_id, numero_clase),
  constraint reserva_clases_fecha_hora_unica unique (reserva_id, fecha, hora)
);

create index if not exists reserva_clases_reserva_id_idx
  on public.reserva_clases (reserva_id);

create unique index if not exists reserva_clases_google_event_id_unico
  on public.reserva_clases (google_calendar_event_id)
  where google_calendar_event_id is not null;

alter table public.reserva_clases enable row level security;

insert into public.reserva_clases (
  reserva_id,
  numero_clase,
  fecha,
  hora,
  duracion_minutos,
  google_calendar_event_id,
  estado_sincronizacion,
  creado_en,
  actualizado_en
)
select
  r.id,
  1,
  r.fecha,
  r.hora,
  r.duracion_minutos,
  r.google_calendar_event_id,
  case
    when r.google_calendar_event_id is not null then 'creado'
    else 'pendiente'
  end,
  r.creado_en,
  r.actualizado_en
from public.reservas r
on conflict (reserva_id, numero_clase) do nothing;

create or replace function public.crear_reserva_con_clases(
  p_reserva jsonb,
  p_clases jsonb
)
returns public.reservas
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_reserva public.reservas;
  v_clase jsonb;
begin
  insert into public.reservas
  select * from jsonb_populate_record(null::public.reservas, p_reserva)
  returning * into v_reserva;

  for v_clase in select * from jsonb_array_elements(p_clases)
  loop
    insert into public.reserva_clases (
      id,
      reserva_id,
      numero_clase,
      fecha,
      hora,
      duracion_minutos,
      google_calendar_event_id,
      estado_sincronizacion,
      creado_en,
      actualizado_en
    ) values (
      (v_clase->>'id')::uuid,
      v_reserva.id,
      (v_clase->>'numero_clase')::integer,
      (v_clase->>'fecha')::date,
      (v_clase->>'hora')::time,
      (v_clase->>'duracion_minutos')::integer,
      null,
      'pendiente',
      (v_clase->>'creado_en')::timestamptz,
      (v_clase->>'actualizado_en')::timestamptz
    );
  end loop;

  return v_reserva;
end;
$$;

revoke all on function public.crear_reserva_con_clases(jsonb, jsonb) from public;
grant execute on function public.crear_reserva_con_clases(jsonb, jsonb) to service_role;
