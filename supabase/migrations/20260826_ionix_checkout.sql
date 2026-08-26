-- Campos mínimos para asociar una reserva con una orden Ionix Checkout OneShot.
alter table public.reservas
  add column if not exists ionix_order_id bigint,
  add column if not exists ionix_commerce_order text,
  add column if not exists ionix_estado text,
  add column if not exists ionix_checkout_url text,
  add column if not exists ionix_monto integer,
  add column if not exists ionix_autorizacion_id text,
  add column if not exists ionix_gateway text,
  add column if not exists ionix_pagado_en timestamptz,
  add column if not exists ionix_intento integer not null default 0;

create unique index if not exists reservas_ionix_order_id_unico
  on public.reservas (ionix_order_id)
  where ionix_order_id is not null;

create unique index if not exists reservas_ionix_commerce_order_unico
  on public.reservas (ionix_commerce_order)
  where ionix_commerce_order is not null;
