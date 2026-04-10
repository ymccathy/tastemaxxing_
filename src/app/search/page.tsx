"use client";
import { useState, useMemo, useEffect } from "react";
import { artists, venues, SEED_LOGS, Rating } from "@/lib/data";
import { getStoredLogs } from "@/lib/logs";
import Link from "next/link";

const RATING_LABEL: Record<Rating, string> = {
  "worth-it": "Worth It",
  "mid": "Mid",
  "skip": "Skip",
};

const RATING_STYLE: Record<Rating, React.CSSProperties> = {
  "worth-it": { backgroundColor: "rgba(255,116,108,0.15)", color: "#FF746C" },
  "mid":       { backgroundColor: "rgba(255,255,255,0.07)", color: "#a1a1aa" },
  "skip":      { backgroundColor: "rgba(239,68,68,0.15)",   color: "#f87171" },
};

type Result = { name: string; type: "artist" | "venue"; slug: string; sub: string };

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [allLogs, setAllLogs] = useState([...SEED_LOGS]);

  useEffect(() => {
    setAllLogs([...getStoredLogs(), ...SEED_LOGS]);
  }, []);

  const results: Result[] = useMemo(() => {
    if (query.trim().length < 1) return [];
    const q = query.toLowerCase();
    const a: Result[] = artists
      .filter((x) => x.name.toLowerCase().includes(q))
      .map((x) => ({ name: x.name, type: "artist", slug: x.slug, sub: x.genres.join(" · ") }));
    const v: Result[] = venues
      .filter((x) => x.name.toLowerCase().includes(q))
      .map((x) => ({ name: x.name, type: "venue", slug: x.slug, sub: x.neighborhood }));
    return [...a, ...v].slice(0, 8);
  }, [query]);

  function getRatingBreakdown(name: string) {
    const matching = allLogs.filter((l) =>
      l.subject.toLowerCase().includes(name.toLowerCase())
    );
    if (matching.length === 0) return null;
    const worthIt = matching.filter((l) => l.rating === "worth-it").length;
    const pct = Math.round((worthIt / matching.length) * 100);
    const latest = matching[0];
    return { total: matching.length, pct, latest, matching };
  }

  return (
    <div className="space-y-5 pb-4">
      <div className="pt-2">
        <h1 className="text-2xl font-black tracking-tight mb-4" style={{ fontFamily: "'Clash Display', sans-serif" }}>
          Search
        </h1>
        <input
          autoFocus
          type="text"
          placeholder="Artist or venue…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-[#141414] border border-[#242424] rounded-2xl px-4 py-3 text-white text-base placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
        />
      </div>

      {query.length > 0 && results.length === 0 && (
        <p className="text-zinc-600 text-sm text-center py-8">No results for &ldquo;{query}&rdquo;</p>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((r) => {
            const breakdown = getRatingBreakdown(r.name);
            return (
              <Link
                key={r.slug}
                href={`/log?subject=${encodeURIComponent(r.name)}&type=${r.type}`}
                className="card-accent flex items-center justify-between bg-[#141414] border border-[#242424] rounded-2xl p-4 hover:border-zinc-600 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white font-semibold">{r.name}</p>
                    <span className="text-[10px] uppercase tracking-wider text-zinc-600 font-bold">{r.type}</span>
                  </div>
                  <p className="text-zinc-500 text-xs mt-0.5">{r.sub}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  {breakdown ? (
                    <>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={RATING_STYLE[breakdown.latest.rating]}>
                        {RATING_LABEL[breakdown.latest.rating]}
                      </span>
                      <p className="text-zinc-600 text-[10px] mt-1">{breakdown.pct}% worth it · {breakdown.total} logs</p>
                    </>
                  ) : (
                    <span className="text-zinc-600 text-xs">No logs yet</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {query.length === 0 && (
        <div className="space-y-2 pt-2">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">Recently logged</p>
          {allLogs.slice(0, 5).map((log) => (
            <Link
              key={log.id}
              href={`/log?subject=${encodeURIComponent(log.subject)}&type=${log.subjectType}`}
              className="flex items-center justify-between py-3 border-b border-[#1f1f1f]"
            >
              <p className="text-zinc-300 text-sm">{log.subject}</p>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={RATING_STYLE[log.rating]}>
                {RATING_LABEL[log.rating]}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
