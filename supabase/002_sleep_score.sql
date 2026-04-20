-- Migration: replace sleep_bed/sleep_wake with sleep_hours + sleep_score
-- Run this in Supabase SQL Editor

ALTER TABLE daily_logs DROP COLUMN IF EXISTS sleep_bed;
ALTER TABLE daily_logs DROP COLUMN IF EXISTS sleep_wake;
ALTER TABLE daily_logs ADD COLUMN sleep_hours numeric(4,2);
ALTER TABLE daily_logs ADD COLUMN sleep_score int;
