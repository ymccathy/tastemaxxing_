"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TAGS, Rating, Log } from "@/lib/data";
import { saveLog } from "@/lib/logs";

const RATING_OPTIONS: { value: Rating; label: string; style: React.CSSProperties; activeStyle: React.CSSProperties }[] = [
  {
    value: "worth-it",
    label: "Worth It",
    style:       { backgroundColor: "#1f1f1f", color: "#9ca3af", border: "1px solid #2a2a2a" },
    activeStyle: { backgroundColor: "rgba(255,116,108,0.15)", color: "#FF746C", border: "1px solid rgba(255,116,108,0.4)" },
  },
  {
    value: "mid",
    label: "Mid",
    style:       { backgroundColor: "#1f1f1f", color: "#9ca3af", border: "1px solid #2a2a2a" },
    activeStyle: { backgroundColor: "rgba(255,255,255,0.07)", color: "#d4d4d8", border: "1px solid rgba(255,255,255,0.15)" },
  },
  {
    value: "skip",
    label: "Skip",
    style:       { backgroundColor: "#1f1f1f", color: "#9ca3af", border: "1px solid #2a2a2a" },
    activeStyle: { backgroundColor: "rgba(239,68,68,0.15)", color: "#f87171", border: "1px solid rgba(239,68,68,0.3)" },
  },
];

function LogForm() {
  const router = useRouter();
  const params = useSearchParams();

  const [subject, setSubject] = useState(params.get("subject") ?? "");
  const [rating, setRating] = useState<Rating | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [done, setDone] = useState(false);

  function toggleTag(tag: string) {
    setTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : prev.length < 3 ? [...prev, tag] : prev
    );
  }

  function submit() {
    if (!subject.trim() || !rating) return;
    const log: Log = {
      id: `u_${Date.now()}`,
      authorName: "You",
      authorAvatar: "ME",
      subject: subject.trim(),
      subjectType: (params.get("type") as "artist" | "venue") ?? "artist",
      rating,
      tags,
      note: note.trim() || undefined,
      date: new Date().toISOString(),
    };
    saveLog(log);
    setDone(true);
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4 text-center">
        <p className="text-5xl">🎉</p>
        <h2 className="text-2xl font-black" style={{ fontFamily: "'Clash Display', sans-serif" }}>Logged.</h2>
        <p className="text-zinc-500 text-sm">Your friends can see it now.</p>
        <div className="flex gap-3 pt-2">
          <button
            onClick={() => router.push("/")}
            className="px-5 py-2.5 rounded-full text-sm font-bold"
            style={{ backgroundColor: "#FF746C", color: "#000" }}
          >
            See feed
          </button>
          <button
            onClick={() => { setSubject(""); setRating(null); setTags([]); setNote(""); setDone(false); }}
            className="px-5 py-2.5 rounded-full text-sm font-semibold bg-[#1f1f1f] text-zinc-400"
          >
            Log another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7 pb-4">
      <div className="pt-2">
        <h1 className="text-2xl font-black tracking-tight" style={{ fontFamily: "'Clash Display', sans-serif" }}>
          What did you see?
        </h1>
      </div>

      {/* Subject */}
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Artist or venue name…"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full bg-[#141414] border border-[#242424] rounded-2xl px-4 py-3 text-white text-base placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
        />
      </div>

      {/* Rating */}
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Was it worth it?</p>
        <div className="grid grid-cols-3 gap-2">
          {RATING_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setRating(opt.value)}
              className="py-4 rounded-2xl font-black text-base transition-all"
              style={rating === opt.value ? opt.activeStyle : opt.style}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tags — max 3 */}
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
          Tags <span className="text-zinc-700 normal-case font-normal">pick up to 3</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {TAGS.map((tag) => {
            const selected = tags.includes(tag);
            const maxed = tags.length >= 3 && !selected;
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                disabled={maxed}
                className="px-3 py-1.5 rounded-full text-sm font-semibold transition-colors disabled:opacity-30"
                style={
                  selected
                    ? { backgroundColor: "#FF746C", color: "#000" }
                    : { backgroundColor: "#1f1f1f", color: "#a1a1aa" }
                }
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Note */}
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
          Note <span className="text-zinc-700 normal-case font-normal">optional</span>
        </p>
        <textarea
          rows={3}
          maxLength={280}
          placeholder="One thing your friends should know…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full bg-[#141414] border border-[#242424] rounded-2xl px-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-500 resize-none"
        />
        {note.length > 0 && (
          <p className="text-right text-xs text-zinc-700">{note.length}/280</p>
        )}
      </div>

      {/* Submit */}
      <button
        onClick={submit}
        disabled={!subject.trim() || !rating}
        className="w-full py-4 rounded-2xl font-black text-base transition-opacity disabled:opacity-25 disabled:cursor-not-allowed"
        style={{ backgroundColor: "#FF746C", color: "#000" }}
      >
        Post
      </button>
    </div>
  );
}

export default function LogPage() {
  return (
    <Suspense>
      <LogForm />
    </Suspense>
  );
}
