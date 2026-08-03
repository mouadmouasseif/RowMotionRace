"use client";

import type { JudgeRole } from "@/types/live-race";

const roles: JudgeRole[] = ["START_JUDGE", "FINISH_JUDGE", "COURSE_JUDGE", "CHIEF_JUDGE", "TIMEKEEPER", "ADMIN"];

export function JudgeAssignment() {
  return (
    <section className="race-card rounded-lg p-4">
      <h2 className="text-sm font-semibold">Judge Assignment</h2>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
        {roles.map((role) => <span key={role} className="rounded-md border border-white/[0.07] bg-white/[0.03] px-3 py-2">{role.replaceAll("_", " ")}</span>)}
      </div>
    </section>
  );
}
