-- Núcleo: finanças MVP (sync futuro com app)
-- Aplicar quando Supabase + auth + families estiverem ativos.

create type public.transaction_type as enum ('expense', 'income');

create table public.finance_categories (
  id text not null,
  family_id uuid not null references public.families (id) on delete cascade,
  label text not null,
  sort_order int not null default 0,
  primary key (family_id, id)
);

create table public.finance_transactions (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  created_by uuid not null references auth.users (id),
  date_local date not null,
  type public.transaction_type not null,
  amount_cents int not null check (amount_cents > 0),
  category_id text not null,
  description text not null default '',
  created_at timestamptz not null default now(),
  foreign key (family_id, category_id) references public.finance_categories (family_id, id)
);

create table public.finance_weekly_budgets (
  family_id uuid not null references public.families (id) on delete cascade,
  week_start date not null,
  limit_cents int not null check (limit_cents > 0),
  updated_at timestamptz not null default now(),
  primary key (family_id, week_start)
);

create table public.finance_allowances (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  member_id uuid references public.family_members (id) on delete set null,
  child_name text not null,
  weekly_amount_cents int not null check (weekly_amount_cents > 0),
  balance_cents int not null default 0,
  updated_at timestamptz not null default now()
);

-- RLS: apenas tutores (ajustar função is_family_tutor quando existir)
-- alter table ... enable row level security;

comment on table public.finance_transactions is 'MVP manual; importação bancária numa migração futura.';
