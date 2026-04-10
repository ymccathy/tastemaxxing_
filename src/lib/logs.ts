import { Log } from "./data";

const KEY = "tm_logs";

export function getStoredLogs(): Log[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveLog(log: Log): void {
  const logs = getStoredLogs();
  localStorage.setItem(KEY, JSON.stringify([log, ...logs]));
}
