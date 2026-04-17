"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "./supabase";
import { DailyLog, DailyLogUpdate } from "./types";

const DEBOUNCE_MS = 500;

export function useDailyLog(date: string) {
  const [log, setLog] = useState<DailyLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestRef = useRef<DailyLogUpdate | null>(null);

  // Fetch or create the daily log for the given date
  useEffect(() => {
    let cancelled = false;

    async function fetchOrCreate() {
      setLoading(true);

      // Try to fetch existing
      const { data, error } = await supabase
        .from("daily_logs")
        .select("*")
        .eq("date", date)
        .single();

      if (cancelled) return;

      if (data && !error) {
        setLog(data as DailyLog);
        setLoading(false);
        return;
      }

      // Not found → create empty row
      const { data: created, error: createError } = await supabase
        .from("daily_logs")
        .insert({ date })
        .select()
        .single();

      if (cancelled) return;

      if (created && !createError) {
        setLog(created as DailyLog);
      }
      setLoading(false);
    }

    fetchOrCreate();

    return () => {
      cancelled = true;
    };
  }, [date]);

  // Flush any pending save
  const flush = useCallback(async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (latestRef.current && log) {
      setSaving(true);
      await supabase
        .from("daily_logs")
        .update({ ...latestRef.current, updated_at: new Date().toISOString() })
        .eq("date", date);
      latestRef.current = null;
      setSaving(false);
    }
  }, [date, log]);

  // Update a field with debounce
  const updateField = useCallback(
    (fields: DailyLogUpdate) => {
      // Optimistic local update
      setLog((prev) => (prev ? { ...prev, ...fields } : prev));

      // Accumulate changes
      latestRef.current = { ...latestRef.current, ...fields };

      // Debounce the save
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(async () => {
        if (!latestRef.current) return;
        setSaving(true);
        const payload = { ...latestRef.current, updated_at: new Date().toISOString() };
        await supabase
          .from("daily_logs")
          .update(payload)
          .eq("date", date);
        latestRef.current = null;
        setSaving(false);
      }, DEBOUNCE_MS);
    },
    [date]
  );

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { log, loading, saving, updateField, flush };
}
