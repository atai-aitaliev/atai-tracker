/**
 * Parse "HH:MM" or "HH:MM:SS" timestring into fractional hours
 */
function timeToHours(t: string): number {
  const parts = t.split(":");
  return parseInt(parts[0], 10) + parseInt(parts[1], 10) / 60;
}

/**
 * Calculate sleep duration from bed time and wake time.
 *
 * If sleep_bed > sleep_wake → crossed midnight → 24 - bed + wake
 * If sleep_bed < sleep_wake → same day (nap-like, unusual) → wake - bed
 *
 * Returns hours rounded to 0.1
 */
export function calculateSleepHours(
  sleepBed: string | null,
  sleepWake: string | null
): number | null {
  if (!sleepBed || !sleepWake) return null;

  const bed = timeToHours(sleepBed);
  const wake = timeToHours(sleepWake);

  let hours: number;
  if (bed > wake) {
    // Crossed midnight (normal case: went to bed at 23:00, woke at 07:00)
    hours = 24 - bed + wake;
  } else {
    // Same day
    hours = wake - bed;
  }

  return Math.round(hours * 10) / 10;
}

/**
 * Get sleep color based on hours.
 * < 7 → red, 7-8 → yellow, ≥ 8 → green
 */
export function getSleepColor(hours: number | null): string {
  if (hours === null) return "#1A1A1A";
  if (hours < 7) return "#DC2626";
  if (hours < 8) return "#CA8A04";
  return "#16A34A";
}

/**
 * Check if a date is a workout day (Tue/Thu/Sun).
 */
export function isWorkoutDay(dateStr: string): boolean {
  const d = new Date(dateStr + "T00:00:00");
  const day = d.getDay(); // 0=Sun, 2=Tue, 4=Thu
  return day === 0 || day === 2 || day === 4;
}

/**
 * Format date to Russian locale string like "Пятница, 17 апреля"
 */
export function formatDateRu(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

/**
 * Get today's date in YYYY-MM-DD format (local timezone)
 */
export function getTodayDate(): string {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

/**
 * Get array of last N dates as YYYY-MM-DD strings (most recent first)
 */
export function getLastNDates(n: number): string[] {
  const dates: string[] = [];
  const now = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
}
