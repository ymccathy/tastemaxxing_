export type AttendanceStatus = "going" | "interested";

export type AttendanceRecord = {
  user_id: string;
  status: AttendanceStatus;
};

export type MockUser = {
  id: string;
  name: string;
  avatarUrl: string;
};

// Each user gets a stable pravatar.cc img param so photos are consistent across renders.
export const MOCK_USERS: MockUser[] = [
  { id: "user-1",  name: "Maya R.",    avatarUrl: "https://i.pravatar.cc/150?img=5"  },
  { id: "user-2",  name: "Carlos M.",  avatarUrl: "https://i.pravatar.cc/150?img=12" },
  { id: "user-3",  name: "Jordan T.",  avatarUrl: "https://i.pravatar.cc/150?img=18" },
  { id: "user-4",  name: "Sam L.",     avatarUrl: "https://i.pravatar.cc/150?img=25" },
  { id: "user-5",  name: "Priya K.",   avatarUrl: "https://i.pravatar.cc/150?img=31" },
  { id: "user-6",  name: "Alex W.",    avatarUrl: "https://i.pravatar.cc/150?img=44" },
  { id: "user-7",  name: "Kseniya K.", avatarUrl: "https://i.pravatar.cc/150?img=57" },
  { id: "user-8",  name: "Mary A.",    avatarUrl: "https://i.pravatar.cc/150?img=62" },
  { id: "user-9",  name: "Devon M.",   avatarUrl: "https://i.pravatar.cc/150?img=15" },
  { id: "user-10", name: "Tara N.",    avatarUrl: "https://i.pravatar.cc/150?img=48" },
];

// Hardcoded current user — replace with real auth when available.
export const CURRENT_USER: MockUser = {
  id: "user-me",
  name: "You",
  avatarUrl: "https://i.pravatar.cc/150?img=70",
};

export function getUserById(id: string): MockUser | undefined {
  if (id === CURRENT_USER.id) return CURRENT_USER;
  return MOCK_USERS.find((u) => u.id === id);
}

/**
 * Returns deterministic per-event seed data so each event page looks distinct
 * without requiring Supabase to be configured.
 */
export function getSeedAttendance(eventSlug: string): {
  going: AttendanceRecord[];
  interested: AttendanceRecord[];
} {
  const hash = eventSlug.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const n = MOCK_USERS.length;

  const gi = [hash % n, (hash + 2) % n, (hash + 5) % n];
  const ii = [(hash + 1) % n, (hash + 3) % n].filter((x) => !gi.includes(x));

  return {
    going: gi.map((i) => ({ user_id: MOCK_USERS[i].id, status: "going" as const })),
    interested: ii.map((i) => ({ user_id: MOCK_USERS[i].id, status: "interested" as const })),
  };
}
