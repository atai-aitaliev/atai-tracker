"use client";

import Link from "next/link";
import DayForm from "./components/DayForm";
import { getTodayDate } from "@/lib/utils";

export default function Home() {
  const today = getTodayDate();

  return (
    <main className="mx-auto max-w-[480px] px-4 py-6 pb-20">
      <DayForm date={today} />

      {/* Navigation */}
      <nav className="mt-10 flex items-center justify-between text-[14px]">
        <Link
          href="/week"
          className="text-[#3F7D58] hover:underline"
        >
          Сводка за неделю →
        </Link>
      </nav>
    </main>
  );
}
