-- Núcleo: finanças expandidas (alinhado à planilha familiar)
-- Aplicar quando Supabase + auth + families estiverem ativos.

create type public.transaction_type as enum ('expense', 'income');

create type public.payment_method as enum (
  'cash', 'card', 'transfer', 'mbway', 'direct_debit', 'other', ''
);

create type public.balance_kind as enum ('asset', 'liability');

create table public.finance_category_groups (
  id text not null,
  family_id uuid not null references public.families (id) on delete cascade,
  label text not null,
  kind text not null check (kind in ('expense', 'income', 'both')),
  sort_order int not null default 0,
  primary key (family_id, id)
);

create table public.finance_categories (
  id text not null,
  family_id uuid not null references public.families (id) on delete cascade,
  group_id text not null,
  label text not null,
  kind public.transaction_type not null,
  sort_order int not null default 0,
  primary key (family_id, id),
  foreign key (family_id, group_id) references public.finance_category_groups (family_id, id)
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
  payment_method public.payment_method not null default '',
  created_at timestamptz not null default now(),
  foreign key (family_id, category_id) references public.finance_categories (family_id, id)
);

create table public.finance_monthly_budgets (
  family_id uuid not null references public.families (id) on delete cascade,
  year int not null check (year >= 2000),
  month int not null check (month between 1 and 12),
  category_id text not null,
  projected_cents int not null check (projected_cents >= 0),
  updated_at timestamptz not null default now(),
  primary key (family_id, year, month, category_id),
  foreign key (family_id, category_id) references public.finance_categories (family_id, id)
);

create table public.finance_balance_items (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  description text not null,
  category text not null default '',
  kind public.balance_kind not null,
  start_date_local date not null,
  initial_cents int not null,
  current_cents int not null,
  updated_at timestamptz not null default now()
);

create table public.finance_loans (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  description text not null,
  initial_cents int not null check (initial_cents > 0),
  term_months int not null check (term_months > 0),
  annual_rate_percent numeric(6, 2) not null default 0,
  start_date_local date not null,
  balance_item_id uuid references public.finance_balance_items (id) on delete set null
);

create table public.finance_shopping_items (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  description text not null,
  max_spend_cents int,
  target_month int check (target_month between 1 and 12),
  target_year int,
  done boolean not null default false,
  created_at timestamptz not null default now()
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

comment on table public.finance_transactions is 'Ledger manual; importação CSV/OFX/XLSX via app.';
comment on table public.finance_monthly_budgets is 'Orçamento mensal projetado por categoria.';
