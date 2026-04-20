"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { DailyLog } from "@/lib/types";
import {
  getSleepScoreColor,
  getSleepHoursColor,
  isWorkoutDay,
  getLastNDates,
} from "@/lib/utils";

export default function WeekPage() {
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [loading, setLoading] = useState(true);

  const dates = getLastNDates(7);
  const startDate = dates[dates.length - 1]; // oldest
  const endDate = dates[0]; // newest (today)

  useEffect(() => {
    async function fetch7Days() {
      setLoading(true);
      const { data } = await supabase
        .from("daily_logs")
        .select("*")
        .gte("date", startDate)
        .lte("date", endDate)
        .order("date", { ascending: false });

      setLogs((data as DailyLog[]) || []);
      setLoading(false);
    }
    fetch7Days();
  }, [startDate, endDate]);

  // Build a map for quick lookup
  const logMap = new Map<string, DailyLog>();
  logs.forEach((l) => logMap.set(l.date, l));

  // === Aggregates ===

  // Sleep score average
  const scoreValues: number[] = [];
  const hoursValues: number[] = [];
  logs.forEach((l) => {
    if (l.sleep_score !== null && l.sleep_score !== undefined) scoreValues.push(Number(l.sleep_score));
    if (l.sleep_hours !== null && l.sleep_hours !== undefined) hoursValues.push(Number(l.sleep_hours));
  });
  const avgScore =
    scoreValues.length > 0
      ? Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length)
      : null;
  const avgHours =
    hoursValues.length > 0
      ? Math.round((hoursValues.reduce((a, b) => a + b, 0) / hoursValues.length) * 10) / 10
      : null;

  // Priorities: count done / total possible (3 per day × 7 = 21)
  let prioritiesDone = 0;
  const prioritiesTotal = 21;
  logs.forEach((l) => {
    if (l.priority_work_done) prioritiesDone++;
    if (l.priority_tazkiya_done) prioritiesDone++;
    if (l.priority_personal_done) prioritiesDone++;
  });

  // Tazkiya hours sum
  let tazkiyaSum = 0;
  logs.forEach((l) => {
    if (l.tazkiya_hours) tazkiyaSum += Number(l.tazkiya_hours);
  });
  tazkiyaSum = Math.round(tazkiyaSum * 10) / 10;

  // Workouts: done / possible workout days in the window
  const workoutDays = dates.filter((d) => isWorkoutDay(d));
  let workoutsDone = 0;
  workoutDays.forEach((d) => {
    const l = logMap.get(d);
    if (l?.workout_done === true) workoutsDone++;
  });

  if (loading) {
    return (
      <main className="mx-auto max-w-[480px] px-4 py-6">
        <p className="text-[14px] text-[#1A1A1A]/40 py-20 text-center">
          Загрузка…
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[480px] px-4 py-6 pb-20">
      <h1 className="text-[32px] font-semibold tracking-tight mb-6">
        Последние 7 дней
      </h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="rounded-[12px] bg-white border border-[#1A1A1A]/5 p-4">
          <p className="text-[14px] text-[#1A1A1A]/50 mb-1">Сон</p>
          <p className="text-[20px] font-semibold tabular-nums" style={{ color: getSleepScoreColor(avgScore) }}>
            {avgScore !== null ? avgScore : "—"}
          </p>
          {avgHours !== null && (
            <p className="text-[12px] tabular-nums text-[#1A1A1A]/30 mt-0.5">
              {avgHours} ч среднее
            </p>
          )}
          {avgHours === null && (
            <p className="text-[12px] text-[#1A1A1A]/30 mt-0.5">sleep score</p>
          )}
        </div>
        <SummaryCard
          title="Приоритеты"
          value={`${prioritiesDone} / ${prioritiesTotal}`}
          valueColor={prioritiesDone >= 15 ? "#16A34A" : prioritiesDone >= 10 ? "#CA8A04" : "#DC2626"}
          subtitle="закрыто"
        />
        <SummaryCard
          title="Часы Тазкии"
          value={`${tazkiyaSum} ч`}
          valueColor="#3F7D58"
          subtitle="всего"
        />
        <SummaryCard
          title="Тренировки"
          value={`${workoutsDone} / ${workoutDays.length}`}
          valueColor={workoutsDone === workoutDays.length && workoutDays.length > 0 ? "#16A34A" : "#CA8A04"}
          subtitle="выполнено"
        />
      </div>

      {/* Day-by-day list */}
      <section>
        <h2 className="text-[14px] font-medium text-[#1A1A1A]/50 uppercase tracking-wide mb-3">
          По дням
        </h2>
        <div className="space-y-2">
          {dates.map((d) => {
            const l = logMap.get(d);
            const score = l?.sleep_score ?? null;
            const hours = l?.sleep_hours ?? null;
            const dayLabel = new Date(d + "T00:00:00").toLocaleDateString("ru-RU", {
              weekday: "short",
              day: "numeric",
              month: "short",
            });

            return (
              <Link
                key={d}
                href={`/day/${d}`}
                className="flex items-center justify-between rounded-[12px] bg-white border border-[#1A1A1A]/5 px-4 py-3 hover:border-[#3F7D58]/30 transition-colors"
              >
                <span className="text-[16px] capitalize">{dayLabel}</span>
                <div className="flex items-center gap-3 text-[14px]">
                  {/* Sleep score (primary) + hours (secondary) */}
                  <span style={{ color: getSleepScoreColor(score) }}>
                    {score !== null ? score : "—"}
                  </span>
                  {hours !== null && (
                    <span className="text-[12px] text-[#1A1A1A]/30">
                      {hours}ч
                    </span>
                  )}
                  {/* Priorities done count */}
                  <span className="text-[#1A1A1A]/40">
                    {l
                      ? `${[l.priority_work_done, l.priority_tazkiya_done, l.priority_personal_done].filter(Boolean).length}/3`
                      : "—"}
                  </span>
                  {/* Tazkiya */}
                  <span className="text-[#3F7D58]">
                    {l?.tazkiya_hours ? `${l.tazkiya_hours}ч` : "—"}
                  </span>
                  {/* Workout */}
                  {isWorkoutDay(d) && (
                    <span>
                      {l?.workout_done === true ? "✓" : l?.workout_done === false ? "✗" : "—"}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Navigation */}
      <nav className="mt-10 text-[14px]">
        <Link href="/" className="text-[#3F7D58] hover:underline">
          ← Сегодня
        </Link>
      </nav>
    </main>
  );
}

/* === Summary Card === */

function SummaryCard({
  title,
  value,
  valueColor,
  subtitle,
}: {
  title: string;
  value: string;
  valueColor: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-[12px] bg-white border border-[#1A1A1A]/5 p-4">
      <p className="text-[14px] text-[#1A1A1A]/50 mb-1">{title}</p>
      <p className="text-[20px] font-semibold tabular-nums" style={{ color: valueColor }}>
        {value}
      </p>
      <p className="text-[12px] text-[#1A1A1A]/30 mt-0.5">{subtitle}</p>
    </div>
  );
}
