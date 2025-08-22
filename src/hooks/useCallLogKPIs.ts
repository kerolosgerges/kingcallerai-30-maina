import { useMemo } from "react";
import type { CallLog } from "@/hooks/useCallLogs";

// Utility for date formatting by period (day, week, month)
function formatPeriod(date: Date, period: "day" | "week" | "month") {
  if (period === "day") return date.toISOString().slice(0, 10); // YYYY-MM-DD
  if (period === "month") return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`; // YYYY-MM
  if (period === "week") {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay()); // Sun
    return start.toISOString().slice(0, 10); // week start date
  }
}

export function useCallLogKPIs(callLogs: CallLog[]) {
  return useMemo(() => {
    // Total calls
    const total = callLogs.length;

    // Calls per status
    const perStatus: Record<string, number> = {};
    // Calls per agent
    const perAgent: Record<string, number> = {};
    // Calls per day/week/month
    const perDay: Record<string, number> = {};
    const perWeek: Record<string, number> = {};
    const perMonth: Record<string, number> = {};

    for (const log of callLogs) {
      // Status
      const status = (log.status || "unknown").toLowerCase();
      perStatus[status] = (perStatus[status] || 0) + 1;

      // Agent
      const agent = log.agent_name || log.agent_id || "unknown";
      perAgent[agent] = (perAgent[agent] || 0) + 1;

      // Dates
      if (log.created_at) {
        const d = new Date(log.created_at);
        const day = formatPeriod(d, "day");
        const week = formatPeriod(d, "week");
        const month = formatPeriod(d, "month");
        perDay[day] = (perDay[day] || 0) + 1;
        perWeek[week] = (perWeek[week] || 0) + 1;
        perMonth[month] = (perMonth[month] || 0) + 1;
      }
    }

    return {
      total,
      perStatus,
      perAgent,
      perDay,
      perWeek,
      perMonth,
    };
  }, [callLogs]);
}
