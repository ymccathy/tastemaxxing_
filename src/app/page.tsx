"use client";
import { useState, useMemo } from "react";
import { events, artists, venues, reviews, getVenue, getArtist } from "@/lib/data";
import { ReviewCard } from "@/components/ReviewCard";
import { StarRating } from "@/components/StarRating";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// ── Mock data ─────────────────────────────────────────────────────────────────
const MY_GOING = new Set(["good-room-hunee-apr-25", "nowadays-palms-trax-may-3"]);

const FRIENDS: Record<string, { going: string[]; interested: string[] }> = {
  "camelphat-brooklyn-storehouse-apr-10": { going: ["MR", "CM"],  interested: ["JT"]      },
  "good-room-hunee-apr-25":               { going: ["PK", "SL"],  interested: ["AW"]      },
  "elsewhere-dj-seinfeld-apr-19":         { going: ["AW"],        interested: ["CM", "JT"] },
  "kshmr-marquee-apr-10":                 { going: [],            interested: ["MR"]      },
  "nowadays-palms-trax-may-3":            { going: ["SL"],        interested: ["JT"]      },
  "chris-lorenzo-stage-b-may-2":          { going: ["JT", "AW"], interested: ["PK"]      },
  "avant-gardner-peggy-gou-may-10":       { going: ["MR"],        interested: ["CM"]      },
  "schimanski-blawan-may-16":             { going: [],            interested: ["AW", "JT"] },
};

const AVATAR_COLORS: Record<string, string> = {
  MR: "#FF746C", CM: "#6C8EFF", JT: "#6CFFA0",
  PK: "#FFD66C", SL: "#C46CFF", AW: "#6CD9FF",
};

function AvatarDot({ initials, size = 22, outline = false }: { initials: string; size?: number; outline?: boolean }) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold shrink-0"
      style={{
        width: size, height: size,
        backgroundColor: outline ? "transparent" : (AVATAR_COLORS[initials] ?? "#555"),
        border: outline ? `2px solid ${AVATAR_COLORS[initials] ?? "#555"}` : "none",
        fontSize: size * 0.38,
        color: outline ? (AVATAR_COLORS[initials] ?? "#555") : "#000",
        marginLeft: -6,
      }}
    >
      {initials}
    </div>
  );
}

function InterestRow({ slug }: { slug: string }) {
  const f = FRIENDS[slug];
  if (!f || (f.going.length === 0 && f.interested.length === 0)) return null;
  return (
    <div className="mt-3 pt-3 border-t border-[#1f1f1f] flex items-center">
      <div className="flex pl-1.5">
        {f.going.map((a) => <AvatarDot key={a} initials={a} size={24} />)}
        {f.interested.map((a) => <AvatarDot key={a} initials={a} size={24} outline />)}
      </div>
      <span className="text-zinc-500 text-xs ml-3">
        {f.going.length > 0 && `${f.going.length} going`}
        {f.going.length > 0 && f.interested.length > 0 && " · "}
        {f.interested.length > 0 && `${f.interested.length} interested`}
      </span>
    </div>
  );
}

// ── Search helpers ────────────────────────────────────────────────────────────
const today = new Date().toISOString().split("T")[0];
const allEvents = [...events].sort((a, b) => b.date.localeCompare(a.date));

type SearchResult =
  | { kind: "event"; slug: string; name: string; sub: string; date: string; past: boolean }
  | { kind: "artist"; slug: string; name: string; sub: string; rating: number }
  | { kind: "venue"; slug: string; name: string; sub: string; rating: number };

function runSearch(q: string): SearchResult[] {
  const lq = q.toLowerCase();
  const results: SearchResult[] = [];

  allEvents.forEach((e) => {
    const venueName = getVenue(e.venueSlug)?.name ?? "";
    const artistNames = e.lineup.map((s) => getArtist(s)?.name ?? "").join(" ");
    const genreStr = e.genres.join(" ");
    if (
      e.name.toLowerCase().includes(lq) ||
      venueName.toLowerCase().includes(lq) ||
      artistNames.toLowerCase().includes(lq) ||
      genreStr.toLowerCase().includes(lq)
    ) {
      results.push({
        kind: "event",
        slug: e.slug,
        name: e.name,
        sub: `${venueName} · ${e.date}`,
        date: e.date,
        past: e.date < today,
      });
    }
  });

  artists.forEach((a) => {
    if (a.name.toLowerCase().includes(lq) || a.genres.some((g) => g.toLowerCase().includes(lq))) {
      results.push({ kind: "artist", slug: a.slug, name: a.name, sub: a.genres.join(" · "), rating: a.liveRating });
    }
  });

  venues.forEach((v) => {
    if (v.name.toLowerCase().includes(lq) || v.neighborhood.toLowerCase().includes(lq)) {
      results.push({ kind: "venue", slug: v.slug, name: v.name, sub: v.neighborhood, rating: v.overallRating });
    }
  });

  return results.slice(0, 12);
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [query, setQuery] = useState("");
  const searching = query.trim().length > 0;

  const searchResults = useMemo(() => (searching ? runSearch(query.trim()) : []), [query, searching]);

  const upcomingEvents = allEvents.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const myEvents = upcomingEvents.filter((e) => MY_GOING.has(e.slug));
  const suggested = upcomingEvents
    .filter((e) => !MY_GOING.has(e.slug))
    .sort((a, b) => {
      const aF = (FRIENDS[a.slug]?.going.length ?? 0) + (FRIENDS[a.slug]?.interested.length ?? 0);
      const bF = (FRIENDS[b.slug]?.going.length ?? 0) + (FRIENDS[b.slug]?.interested.length ?? 0);
      return bF - aF || b.worthItScore - a.worthItScore;
    });

  const hiddenGems = artists.filter((a) => a.liveRating >= 4.7 && parseInt(a.spotifyFollowers) < 100000);

  const end = new Date(); end.setDate(end.getDate() + 7);
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const weekLabel = `${fmt(new Date())} – ${fmt(end)}`;

  return (
    <div className="space-y-10 pb-4">
      {/* ── Hero + Search ──────────────────────────────────────────────────── */}
      <div className="space-y-4 pt-2">
        {!searching && (
          <>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">{weekLabel}</p>
            <h1
              className="font-black tracking-tight leading-[0.9]"
              style={{ fontSize: "clamp(52px, 13vw, 80px)", fontFamily: "'Clash Display', sans-serif" }}
            >
              What&apos;s good<br />this week
            </h1>
          </>
        )}

        {/* Search bar */}
        <div className="relative">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
            width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search artist, venue, or genre…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#141414] border border-[#242424] rounded-2xl pl-10 pr-4 py-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
          />
          {searching && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors text-lg leading-none"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* ── Search results ─────────────────────────────────────────────────── */}
      {searching && (
        <div className="space-y-2 -mt-4">
          {searchResults.length === 0 && (
            <p className="text-zinc-600 text-sm text-center py-8">No results for &ldquo;{query}&rdquo;</p>
          )}
          {searchResults.map((r, i) => {
            const href = r.kind === "event" ? `/events/${r.slug}` : r.kind === "artist" ? `/artists/${r.slug}` : `/venues/${r.slug}`;
            return (
              <Link
                key={i}
                href={href}
                className="card-accent flex items-center justify-between bg-[#141414] border border-[#242424] rounded-xl p-4 hover:border-zinc-600 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white font-semibold">{r.name}</p>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-600">{r.kind}</span>
                    {r.kind === "event" && r.past && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-zinc-800 text-zinc-500">Past</span>
                    )}
                  </div>
                  <p className="text-zinc-500 text-xs mt-0.5 truncate">{r.sub}</p>
                </div>
                {r.kind !== "event" && (
                  <div className="shrink-0 ml-4">
                    <StarRating rating={r.rating} size="sm" />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}

      {/* ── Normal home content (hidden while searching) ───────────────────── */}
      {!searching && (
        <>
          {/* My Events */}
          {myEvents.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">I&apos;m Going</h2>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
                {myEvents.map((event) => {
                  const venue = getVenue(event.venueSlug);
                  return (
                    <Link
                      key={event.slug}
                      href={`/events/${event.slug}`}
                      className="card-accent shrink-0 w-[220px] bg-[#141414] border border-[#242424] rounded-2xl p-4 hover:border-[#FF746C]/40 transition-colors"
                    >
                      <p className="text-white font-bold text-base leading-tight">{event.name}</p>
                      <p className="text-zinc-500 text-xs mt-1">{venue?.name}</p>
                      <p className="text-zinc-600 text-xs">{event.date} · {event.time}</p>
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {event.genres.slice(0, 2).map((g) => (
                          <Badge key={g} className="text-[10px] bg-[#1f1f1f] text-zinc-400 border-0">{g}</Badge>
                        ))}
                      </div>
                      <InterestRow slug={event.slug} />
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Suggested this week */}
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">This Week</h2>
            <div className="space-y-2">
              {suggested.map((event) => {
                const venue = getVenue(event.venueSlug);
                return (
                  <Link
                    key={event.slug}
                    href={`/events/${event.slug}`}
                    className="card-accent block bg-[#141414] border border-[#242424] rounded-2xl p-4 hover:border-zinc-600 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-base leading-tight">{event.name}</p>
                        <p className="text-zinc-500 text-xs mt-0.5">{venue?.name} · {event.date} · {event.time}</p>
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {event.genres.map((g) => (
                            <Badge key={g} className="text-[10px] bg-[#1f1f1f] text-zinc-400 border-0">{g}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-white font-semibold text-sm">{event.ticketPrice}</p>
                        {event.worthItScore > 0 && (
                          <p className="text-green-400 text-xs mt-0.5">{event.worthItScore}% worth it</p>
                        )}
                      </div>
                    </div>
                    <InterestRow slug={event.slug} />
                  </Link>
                );
              })}
            </div>
          </section>

          {/* Hidden Gems */}
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Hidden Gems</h2>
            <p className="text-zinc-500 text-xs">High live ratings. Low Spotify followers. Go see them.</p>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
              {hiddenGems.map((artist) => (
                <Link
                  key={artist.slug}
                  href={`/artists/${artist.slug}`}
                  className="card-accent shrink-0 w-[200px] bg-[#141414] border border-[#242424] rounded-xl p-4 hover:border-[#FF746C]/40 transition-colors"
                >
                  <p className="text-white font-semibold text-sm">{artist.name}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{artist.genres[0]}</p>
                  <div className="flex items-center justify-between mt-2">
                    <StarRating rating={artist.liveRating} size="sm" />
                    <span className="text-zinc-600 text-xs">{artist.spotifyFollowers}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {artist.tags.slice(0, 2).map((t) => (
                      <Badge key={t} className="text-[10px] bg-[#1f1f1f] text-zinc-400 border-0">#{t}</Badge>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Review feed */}
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Recent Reviews</h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
