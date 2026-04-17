"use client";

import { use } from "react";
import Link from "next/link";
import DayForm from "@/app/components/DayForm";

interface DayPageProps {
  params: Promise<{ date: string }>;
}

export default function DayPage({ params }: DayPageProps) {
  const { date } = use(params);

  return (
    <main className="mx-auto max-w-[480px] px-4 py-6 pb-20">
      <DayForm date={date} />

      {/* Navigation */}
      <nav className="mt-10 flex items-center justify-between text-[14px]">
        <Link href="/" className="text-[#3F7D58] hover:underline">
          ← Сегодня
        </Link>
        <Link href="/week" className="text-[#3F7D58] hover:underline">
          Сводка за неделю →
        </Link>
      </nav>
    </main>
  );
}
