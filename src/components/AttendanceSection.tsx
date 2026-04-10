"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { createClient, supabaseConfigured } from "@/lib/supabase";
import {
  AttendanceStatus,
  AttendanceRecord,
  MockUser,
  CURRENT_USER,
  getUserById,
  getSeedAttendance,
} from "@/lib/attendance";

const BRAND = "#FF746C";

// ── Avatar cluster ────────────────────────────────────────────────────────────

function AvatarCluster({ records }: { records: AttendanceRecord[] }) {
  const shown = records.slice(0, 5);
  const overflow = records.length - shown.length;
  return (
    <div className="flex -space-x-2">
      {shown.map((r) => {
        const user = getUserById(r.user_id);
        return user ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={r.user_id}
            src={user.avatarUrl}
            alt={user.name}
            width={28}
            height={28}
            className="w-7 h-7 rounded-full border-2 border-[#141414] object-cover"
          />
        ) : null;
      })}
      {overflow > 0 && (
        <div className="w-7 h-7 rounded-full border-2 border-[#141414] bg-[#1f1f1f] flex items-center justify-center text-[9px] font-bold text-zinc-500 shrink-0">
          +{overflow}
        </div>
      )}
    </div>
  );
}

// ── Bottom sheet ──────────────────────────────────────────────────────────────

function BottomSheet({
  open,
  tab,
  going,
  interested,
  onClose,
  onTabChange,
}: {
  open: boolean;
  tab: "going" | "interested";
  going: AttendanceRecord[];
  interested: AttendanceRecord[];
  onClose: () => void;
  onTabChange: (t: "going" | "interested") => void;
}) {
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const touchY = useRef(0);

  function onTouchStart(e: React.TouchEvent) {
    touchY.current = e.touches[0].clientY;
    setDragging(true);
  }
  function onTouchMove(e: React.TouchEvent) {
    const d = e.touches[0].clientY - touchY.current;
    if (d > 0) setDragY(d);
  }
  function onTouchEnd() {
    setDragging(false);
    if (dragY > 80) onClose();
    setDragY(0);
  }

  const list = tab === "going" ? going : interested;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-[#141414] rounded-t-3xl flex flex-col"
        style={{
          maxHeight: "75vh",
          transform: `translateY(${dragY}px)`,
          transition: dragging ? "none" : "transform 0.25s ease-out",
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-zinc-700 rounded-full" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-4 pt-3 pb-3 border-b border-[#242424] shrink-0">
          {(["going", "interested"] as const).map((t) => {
            const icon = t === "going" ? "🪩" : "⭐";
            const count = t === "going" ? going.length : interested.length;
            return (
              <button
                key={t}
                onClick={() => onTabChange(t)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors capitalize"
                style={
                  tab === t
                    ? { backgroundColor: BRAND, color: "#000" }
                    : { backgroundColor: "#1f1f1f", color: "#9ca3af" }
                }
              >
                {icon} {t}{" "}
                <span className="opacity-60">({count})</span>
              </button>
            );
          })}
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 pb-10">
          {list.length === 0 ? (
            <p className="text-zinc-600 text-sm text-center py-12">
              No one yet. Be the first.
            </p>
          ) : (
            list.map((record) => {
              const user = getUserById(record.user_id);
              if (!user) return null;
              return (
                <Link
                  key={record.user_id}
                  href="/profile"
                  onClick={onClose}
                  className="flex items-center gap-4 px-5 py-3.5 border-b border-[#1f1f1f] hover:bg-[#1a1a1a] transition-colors"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                  <span className="flex-1 text-white font-semibold text-sm">
                    {user.name}
                  </span>
                  <span className="text-zinc-600 text-xs">View Profile →</span>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function AttendanceSection({ eventSlug }: { eventSlug: string }) {
  const seed = getSeedAttendance(eventSlug);
  const [going, setGoing] = useState<AttendanceRecord[]>(seed.going);
  const [interested, setInterested] = useState<AttendanceRecord[]>(seed.interested);
  const [myStatus, setMyStatus] = useState<AttendanceStatus | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetTab, setSheetTab] = useState<"going" | "interested">("going");

  // Hydrate from Supabase when configured
  useEffect(() => {
    if (!supabaseConfigured) return;
    const sb = createClient();
    sb.from("event_attendance")
      .select("user_id, status")
      .eq("event_id", eventSlug)
      .then(({ data }) => {
        if (!data) return;
        setGoing(
          (data as AttendanceRecord[]).filter((r) => r.status === "going")
        );
        setInterested(
          (data as AttendanceRecord[]).filter((r) => r.status === "interested")
        );
        const mine = (data as AttendanceRecord[]).find(
          (r) => r.user_id === CURRENT_USER.id
        );
        setMyStatus(mine?.status ?? null);
      });
  }, [eventSlug]);

  async function toggle(status: AttendanceStatus) {
    const prev = myStatus;
    const next: AttendanceStatus | null = prev === status ? null : status;

    // Optimistic update
    setMyStatus(next);
    const myRecord: AttendanceRecord = { user_id: CURRENT_USER.id, status };
    if (prev === "going")
      setGoing((g) => g.filter((r) => r.user_id !== CURRENT_USER.id));
    if (prev === "interested")
      setInterested((i) => i.filter((r) => r.user_id !== CURRENT_USER.id));
    if (next === "going") setGoing((g) => [...g, myRecord]);
    if (next === "interested")
      setInterested((i) => [
        ...i,
        { user_id: CURRENT_USER.id, status: "interested" },
      ]);

    if (!supabaseConfigured) return;
    const sb = createClient();
    if (next === null) {
      await sb
        .from("event_attendance")
        .delete()
        .eq("event_id", eventSlug)
        .eq("user_id", CURRENT_USER.id);
    } else {
      await sb.from("event_attendance").upsert({
        event_id: eventSlug,
        user_id: CURRENT_USER.id,
        status: next,
      });
    }
  }

  function openSheet(tab: "going" | "interested") {
    setSheetTab(tab);
    setSheetOpen(true);
  }

  return (
    <>
      {/* ── Inline social proof block ── */}
      <div className="bg-[#141414] border border-[#242424] rounded-xl p-4 space-y-3">
        <button
          onClick={() => openSheet("going")}
          className="w-full flex items-center gap-3 text-left"
        >
          <span className="text-lg leading-none">🪩</span>
          <span className="text-zinc-400 text-sm font-semibold w-20 shrink-0">
            Going
          </span>
          <AvatarCluster records={going} />
          <span className="text-zinc-500 text-xs ml-1">{going.length}</span>
          <svg
            className="ml-auto shrink-0 text-zinc-700"
            width="14"
            height="14"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
          </svg>
        </button>

        <div className="w-full h-px bg-[#1f1f1f]" />

        <button
          onClick={() => openSheet("interested")}
          className="w-full flex items-center gap-3 text-left"
        >
          <span className="text-lg leading-none">⭐</span>
          <span className="text-zinc-400 text-sm font-semibold w-20 shrink-0">
            Interested
          </span>
          <AvatarCluster records={interested} />
          <span className="text-zinc-500 text-xs ml-1">{interested.length}</span>
          <svg
            className="ml-auto shrink-0 text-zinc-700"
            width="14"
            height="14"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* ── Fixed floating pills — above nav ── */}
      <div className="fixed bottom-[4.5rem] left-0 right-0 z-40 flex justify-center gap-3 px-6 pointer-events-none">
        <div className="flex gap-3 pointer-events-auto">
          <button
            onClick={() => toggle("going")}
            className="flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm shadow-2xl transition-all active:scale-95"
            style={
              myStatus === "going"
                ? { backgroundColor: BRAND, color: "#000", border: `2px solid ${BRAND}` }
                : {
                    backgroundColor: "#141414",
                    color: "#fff",
                    border: "2px solid #3f3f3f",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                  }
            }
          >
            <span className="text-base leading-none">🪩</span>
            I&apos;m Going
          </button>

          <button
            onClick={() => toggle("interested")}
            className="flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm shadow-2xl transition-all active:scale-95"
            style={
              myStatus === "interested"
                ? { backgroundColor: BRAND, color: "#000", border: `2px solid ${BRAND}` }
                : {
                    backgroundColor: "#141414",
                    color: "#fff",
                    border: "2px solid #3f3f3f",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
                  }
            }
          >
            <span className="text-base leading-none">⭐</span>
            Interested
          </button>
        </div>
      </div>

      {/* ── Bottom sheet ── */}
      <BottomSheet
        open={sheetOpen}
        tab={sheetTab}
        going={going}
        interested={interested}
        onClose={() => setSheetOpen(false)}
        onTabChange={setSheetTab}
      />
    </>
  );
}
