-- ═══════════════════════════════════════════════════
-- CodeLash — Initial Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL)
-- ═══════════════════════════════════════════════════

-- ── solved_problems ──────────────────────────────────
create table public.solved_problems (
  id                     uuid        primary key default gen_random_uuid(),
  user_id                uuid        not null references auth.users(id) on delete cascade,
  problem_id             integer     not null,
  title                  text        not null,
  difficulty             text        not null check (difficulty in ('Easy','Medium','Hard')),
  solved_at              timestamptz not null default now(),
  solve_method           text        not null default 'manual' check (solve_method in ('auto','manual')),
  language               text        not null default 'javascript' check (language in ('javascript','python')),
  time_remaining_seconds integer     not null default 0,
  coach_calls_used       integer     not null default 0,
  neetcode_category      text,
  unique(user_id, problem_id)
);

-- ── ai_events ────────────────────────────────────────
create table public.ai_events (
  id         uuid        primary key default gen_random_uuid(),
  user_id    uuid        not null references auth.users(id) on delete cascade,
  type       text        not null check (type in ('coach','interview')),
  problem_id integer     not null,
  created_at timestamptz not null default now()
);

-- ── RLS: solved_problems ─────────────────────────────
alter table public.solved_problems enable row level security;

create policy "Users can select own solved problems"
  on public.solved_problems for select
  using (auth.uid() = user_id);

create policy "Users can insert own solved problems"
  on public.solved_problems for insert
  with check (auth.uid() = user_id);

create policy "Users can update own solved problems"
  on public.solved_problems for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own solved problems"
  on public.solved_problems for delete
  using (auth.uid() = user_id);

-- ── RLS: ai_events ───────────────────────────────────
alter table public.ai_events enable row level security;

create policy "Users can select own ai events"
  on public.ai_events for select
  using (auth.uid() = user_id);

create policy "Users can insert own ai events"
  on public.ai_events for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own ai events"
  on public.ai_events for delete
  using (auth.uid() = user_id);
