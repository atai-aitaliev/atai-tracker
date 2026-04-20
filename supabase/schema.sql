-- Atai Tracker — schema v1.1
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)

create table daily_logs (
  id uuid primary key default gen_random_uuid(),
  date date not null unique,
  sleep_hours numeric(4,2),        -- часы сна, e.g. 7.5
  sleep_score int,                 -- Apple Health sleep score 0-100
  priority_work text,
  priority_work_done boolean default false,
  priority_tazkiya text,
  priority_tazkiya_done boolean default false,
  priority_personal text,
  priority_personal_done boolean default false,
  tazkiya_hours numeric(4,2),      -- десятичные часы, e.g. 2.5
  workout_done boolean,            -- только для вт/чт/вс, иначе null
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for fast lookup by date
create index idx_daily_logs_date on daily_logs(date);

-- RLS: allow all for anon (single-user, no auth)
alter table daily_logs enable row level security;

create policy "Allow all for anon" on daily_logs
  for all
  using (true)
  with check (true);
