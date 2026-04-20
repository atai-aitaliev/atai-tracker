"use client";

import { useDailyLog } from "@/lib/useDailyLog";
import {
  getSleepScoreColor,
  getSleepHoursColor,
  isWorkoutDay,
  formatDateRu,
} from "@/lib/utils";

interface DayFormProps {
  date: string; // YYYY-MM-DD
}

export default function DayForm({ date }: DayFormProps) {
  const { log, loading, saving, updateField } = useDailyLog(date);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-[14px] text-[#1A1A1A]/40">Загрузка…</p>
      </div>
    );
  }

  if (!log) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-[14px] text-[#DC2626]">Ошибка загрузки данных</p>
      </div>
    );
  }

  const showWorkout = isWorkoutDay(date);

  return (
    <div className="space-y-6">
      {/* Date header */}
      <h1 className="text-[32px] font-semibold tracking-tight capitalize">
        {formatDateRu(date)}
      </h1>

      {/* TODO: saving indicator — if needed, render a fixed-position dot here:
        <div className="fixed top-4 right-4 w-2 h-2 rounded-full bg-[#3F7D58] animate-pulse" />
        Use `saving` from useDailyLog to toggle visibility. */}

      {/* === SLEEP === */}
      <section>
        <h2 className="text-[14px] font-medium text-[#1A1A1A]/50 uppercase tracking-wide mb-3">
          Сон
        </h2>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-[14px] text-[#1A1A1A]/60 mb-1">
              Часы сна
            </label>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              max={12}
              step={0.1}
              value={log.sleep_hours ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                updateField({
                  sleep_hours: val === "" ? null : parseFloat(val),
                });
              }}
              placeholder="0"
              className="w-full rounded-[8px] border border-[#1A1A1A]/10 bg-white px-3 py-2.5 text-[16px] outline-none focus:border-[#3F7D58] transition-colors"
            />
          </div>
          <div className="flex-1">
            <label className="block text-[14px] text-[#1A1A1A]/60 mb-1">
              Sleep Score
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              max={100}
              step={1}
              value={log.sleep_score ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                updateField({
                  sleep_score: val === "" ? null : parseInt(val, 10),
                });
              }}
              placeholder="0"
              className="w-full rounded-[8px] border border-[#1A1A1A]/10 bg-white px-3 py-2.5 text-[16px] outline-none focus:border-[#3F7D58] transition-colors"
            />
          </div>
        </div>
        {/* Big score display */}
        <div className="mt-3 flex items-baseline gap-3">
          <p
            className="text-[32px] font-semibold tabular-nums"
            style={{ color: getSleepScoreColor(log.sleep_score) }}
          >
            {log.sleep_score !== null && log.sleep_score !== undefined
              ? log.sleep_score
              : "—"}
          </p>
          {log.sleep_hours !== null && log.sleep_hours !== undefined && (
            <p
              className="text-[16px] tabular-nums"
              style={{ color: getSleepHoursColor(log.sleep_hours) }}
            >
              {log.sleep_hours} ч
            </p>
          )}
        </div>
      </section>

      {/* === PRIORITIES === */}
      <section>
        <h2 className="text-[14px] font-medium text-[#1A1A1A]/50 uppercase tracking-wide mb-3">
          Приоритеты
        </h2>
        <div className="space-y-2">
          <PriorityRow
            label="Работа"
            value={log.priority_work || ""}
            done={log.priority_work_done}
            onTextChange={(v) => updateField({ priority_work: v || null })}
            onToggle={() => updateField({ priority_work_done: !log.priority_work_done })}
          />
          <PriorityRow
            label="Тазкия"
            value={log.priority_tazkiya || ""}
            done={log.priority_tazkiya_done}
            onTextChange={(v) => updateField({ priority_tazkiya: v || null })}
            onToggle={() => updateField({ priority_tazkiya_done: !log.priority_tazkiya_done })}
          />
          <PriorityRow
            label="Личное"
            value={log.priority_personal || ""}
            done={log.priority_personal_done}
            onTextChange={(v) => updateField({ priority_personal: v || null })}
            onToggle={() => updateField({ priority_personal_done: !log.priority_personal_done })}
          />
        </div>
      </section>

      {/* === TAZKIYA HOURS === */}
      <section>
        <h2 className="text-[14px] font-medium text-[#1A1A1A]/50 uppercase tracking-wide mb-3">
          Тазкия
        </h2>
        <label className="block text-[14px] text-[#1A1A1A]/60 mb-1">
          Часов на Тазкию сегодня
        </label>
        <input
          type="number"
          inputMode="decimal"
          min={0}
          max={12}
          step={0.5}
          value={log.tazkiya_hours ?? ""}
          onChange={(e) => {
            const val = e.target.value;
            updateField({
              tazkiya_hours: val === "" ? null : parseFloat(val),
            });
          }}
          placeholder="0"
          className="w-full rounded-[8px] border border-[#1A1A1A]/10 bg-white px-3 py-2.5 text-[16px] outline-none focus:border-[#3F7D58] transition-colors max-w-[140px]"
        />
      </section>

      {/* === WORKOUT === */}
      {showWorkout && (
        <section>
          <h2 className="text-[14px] font-medium text-[#1A1A1A]/50 uppercase tracking-wide mb-3">
            Зал
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => updateField({ workout_done: true })}
              className={`rounded-[8px] px-4 py-2.5 text-[16px] font-medium transition-colors ${
                log.workout_done === true
                  ? "bg-[#3F7D58] text-white"
                  : "bg-[#1A1A1A]/5 text-[#1A1A1A]/60"
              }`}
            >
              Был
            </button>
            <button
              onClick={() => updateField({ workout_done: false })}
              className={`rounded-[8px] px-4 py-2.5 text-[16px] font-medium transition-colors ${
                log.workout_done === false
                  ? "bg-[#DC2626] text-white"
                  : "bg-[#1A1A1A]/5 text-[#1A1A1A]/60"
              }`}
            >
              Не был
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

/* === Priority Row Sub-component === */

interface PriorityRowProps {
  label: string;
  value: string;
  done: boolean;
  onTextChange: (value: string) => void;
  onToggle: () => void;
}

function PriorityRow({ label, value, done, onTextChange, onToggle }: PriorityRowProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToggle}
        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          done
            ? "bg-[#3F7D58] border-[#3F7D58]"
            : "border-[#1A1A1A]/20 bg-transparent"
        }`}
        aria-label={`Отметить "${label}" как выполненное`}
      >
        {done && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2.5 6L5 8.5L9.5 3.5"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
      <input
        type="text"
        value={value}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder={label}
        className={`flex-1 rounded-[8px] border border-[#1A1A1A]/10 bg-white px-3 py-2.5 text-[16px] outline-none focus:border-[#3F7D58] transition-colors placeholder:text-[#1A1A1A]/25 ${
          done ? "line-through text-[#1A1A1A]/40" : ""
        }`}
      />
    </div>
  );
}
