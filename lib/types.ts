export interface DailyLog {
  id: string;
  date: string; // "YYYY-MM-DD"
  sleep_bed: string | null; // "HH:MM:SS" or null
  sleep_wake: string | null; // "HH:MM:SS" or null
  priority_work: string | null;
  priority_work_done: boolean;
  priority_tazkiya: string | null;
  priority_tazkiya_done: boolean;
  priority_personal: string | null;
  priority_personal_done: boolean;
  tazkiya_hours: number | null;
  workout_done: boolean | null;
  created_at: string;
  updated_at: string;
}

/** Fields that can be updated via the form */
export type DailyLogUpdate = Partial<
  Omit<DailyLog, "id" | "created_at" | "updated_at">
>;
