"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { events, venues, artists } from "@/lib/data";
import {
  DimensionRating,
  saveEventReview,
  ratingToScore,
  scoreToEmoji,
  getEventAvgScores,
} from "@/lib/event-reviews";

const BRAND = "#FF746C";

const OPTIONS: { value: DimensionRating; emoji: string; label: string }[] = [
  { value: "loved", emoji: "🔥", label: "Loved it" },
  { value: "fine", emoji: "😐", label: "It was fine" },
  { value: "skip", emoji: "💀", label: "Skip it" },
];

const RATING_STEPS: {
  key: "venueRating" | "artistRating" | "musicRating";
  question: string;
}[] = [
  { key: "venueRating", question: "How was the venue?" },
  { key: "artistRating", question: "How was the artist?" },
  { key: "musicRating", question: "How was the music?" },
];

type SearchResult = {
  type: "event" | "artist" | "venue";
  slug: string;
  name: string;
  sub: string;
};

type Ratings = {
  venueRating: DimensionRating | null;
  artistRating: DimensionRating | null;
  musicRating: DimensionRating | null;
};

type MediaFile = { previewUrl: string; type: "image" | "video"; name: string };

function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }
    const duration = 900;
    const start = Date.now();
    let frame: number;
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target * 10) / 10);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, active]);
  return value;
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className="h-1 rounded-full flex-1 transition-all duration-300"
          style={{ backgroundColor: s <= step ? BRAND : "#242424" }}
        />
      ))}
    </div>
  );
}

function typeIcon(type: SearchResult["type"]) {
  if (type === "event") return "🎵";
  if (type === "artist") return "👤";
  return "📍";
}

export default function WriteReviewPage() {
  const router = useRouter();
  // step: 0=search, 1-3=rating, 4=success
  const [step, setStep] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<SearchResult | null>(null);
  const [ratings, setRatings] = useState<Ratings>({
    venueRating: null,
    artistRating: null,
    musicRating: null,
  });
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState("");
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [countActive, setCountActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const results: SearchResult[] =
    query.trim().length > 0
      ? [
          ...events
            .filter((e) => e.name.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 4)
            .map((e) => ({
              type: "event" as const,
              slug: e.slug,
              name: e.name,
              sub: `${venues.find((v) => v.slug === e.venueSlug)?.name ?? ""} · ${e.date}`,
            })),
          ...artists
            .filter((a) => a.name.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 3)
            .map((a) => ({
              type: "artist" as const,
              slug: a.slug,
              name: a.name,
              sub: a.genres.join(" · "),
            })),
          ...venues
            .filter((v) => v.name.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 3)
            .map((v) => ({
              type: "venue" as const,
              slug: v.slug,
              name: v.name,
              sub: v.neighborhood,
            })),
        ]
      : [];

  // Preview aggregate scores for the success screen (not yet saved)
  const previewVenue =
    step === 4 && ratings.venueRating
      ? (() => {
          const v = ratingToScore(ratings.venueRating);
          if (selected?.type === "event") {
            const ex = getEventAvgScores(selected.slug);
            if (ex.count > 0)
              return Math.round(((ex.venue! * ex.count + v) / (ex.count + 1)) * 10) / 10;
          }
          return v;
        })()
      : null;

  const previewArtist =
    step === 4 && ratings.artistRating
      ? (() => {
          const a = ratingToScore(ratings.artistRating);
          if (selected?.type === "event") {
            const ex = getEventAvgScores(selected.slug);
            if (ex.count > 0)
              return Math.round(((ex.artist! * ex.count + a) / (ex.count + 1)) * 10) / 10;
          }
          return a;
        })()
      : null;

  const previewMusic =
    step === 4 && ratings.musicRating
      ? (() => {
          const m = ratingToScore(ratings.musicRating);
          if (selected?.type === "event") {
            const ex = getEventAvgScores(selected.slug);
            if (ex.count > 0)
              return Math.round(((ex.music! * ex.count + m) / (ex.count + 1)) * 10) / 10;
          }
          return m;
        })()
      : null;

  useEffect(() => {
    if (step === 4) {
      const t = setTimeout(() => setCountActive(true), 150);
      return () => clearTimeout(t);
    }
    setCountActive(false);
  }, [step]);

  const venueDisplay = useCountUp(previewVenue ?? 0, countActive && previewVenue !== null);
  const artistDisplay = useCountUp(previewArtist ?? 0, countActive && previewArtist !== null);
  const musicDisplay = useCountUp(previewMusic ?? 0, countActive && previewMusic !== null);

  function selectTarget(result: SearchResult) {
    setSelected(result);
    setAnimKey((k) => k + 1);
    setStep(1);
  }

  function pickRating(key: "venueRating" | "artistRating" | "musicRating", value: DimensionRating) {
    setRatings((prev) => ({ ...prev, [key]: value }));
    setTimeout(() => {
      setAnimKey((k) => k + 1);
      setStep((s) => s + 1);
    }, 300);
  }

  function handlePost() {
    if (!selected) return;
    if (selected.type === "event") {
      saveEventReview({
        id: `er-${Date.now()}`,
        eventSlug: selected.slug,
        venueRating: ratings.venueRating!,
        artistRating: ratings.artistRating!,
        musicRating: ratings.musicRating!,
        note: note.trim() || undefined,
        media: mediaFiles.map((m) => ({ type: m.type, url: m.previewUrl })),
        date: new Date().toISOString(),
      });
    }
    router.push("/");
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    const newMedia: MediaFile[] = Array.from(files).map((file) => ({
      previewUrl: URL.createObjectURL(file),
      type: file.type.startsWith("video") ? "video" : "image",
      name: file.name,
    }));
    setMediaFiles((prev) => [...prev, ...newMedia]);
    e.target.value = "";
  }

  // ── Step 0: Search ──────────────────────────────────────────────────
  if (step === 0) {
    return (
      <div className="flex flex-col" style={{ minHeight: "calc(100svh - 5rem)" }}>
        <div className="flex items-center justify-between pt-4 pb-6">
          <h1
            className="text-xl font-black"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            Log a show
          </h1>
          <button
            onClick={() => router.push("/")}
            className="text-zinc-500 text-sm hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>

        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
            width="18"
            height="18"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35" />
          </svg>
          <input
            autoFocus
            type="text"
            placeholder="Search event, artist, or venue…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-[#141414] border border-[#242424] rounded-2xl pl-12 pr-4 py-4 text-white text-base placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
          />
        </div>

        {results.length > 0 && (
          <div className="mt-4 space-y-2">
            {results.map((r) => (
              <button
                key={`${r.type}-${r.slug}`}
                onClick={() => selectTarget(r)}
                className="w-full flex items-center gap-4 bg-[#141414] border border-[#242424] rounded-2xl p-4 text-left hover:border-zinc-600 transition-colors"
              >
                <span className="text-2xl leading-none shrink-0">{typeIcon(r.type)}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-white font-semibold truncate">{r.name}</p>
                  <p className="text-zinc-500 text-xs truncate mt-0.5">{r.sub}</p>
                </div>
                <svg
                  className="shrink-0 text-zinc-600"
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                </svg>
              </button>
            ))}
          </div>
        )}

        {query.trim().length > 0 && results.length === 0 && (
          <p className="text-zinc-600 text-sm text-center mt-10">
            No results for &ldquo;{query}&rdquo;
          </p>
        )}

        {query.trim().length === 0 && (
          <p className="text-zinc-600 text-sm text-center mt-12">
            Start typing to search…
          </p>
        )}
      </div>
    );
  }

  // ── Steps 1–3: Rating ───────────────────────────────────────────────
  if (step >= 1 && step <= 3) {
    const stepDef = RATING_STEPS[step - 1];
    return (
      <div
        key={animKey}
        className="flex flex-col animate-in slide-in-from-right-8 fade-in duration-200"
        style={{ minHeight: "calc(100svh - 5rem)" }}
      >
        <div className="flex items-center justify-between pt-4 pb-5">
          <p className="text-zinc-500 text-xs font-semibold truncate max-w-[70%]">
            {selected?.name}
          </p>
          <button
            onClick={() => router.push("/")}
            className="text-zinc-500 text-sm hover:text-white transition-colors"
          >
            Cancel
          </button>
        </div>

        <ProgressBar step={step} />

        <div className="pt-8 pb-8 space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: BRAND }}>
            {step} of 3
          </p>
          <h1
            className="text-3xl font-black tracking-tight leading-tight"
            style={{ fontFamily: "'Clash Display', sans-serif" }}
          >
            {stepDef.question}
          </h1>
        </div>

        <div className="space-y-3 flex-1">
          {OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => pickRating(stepDef.key, opt.value)}
              className="w-full flex items-center gap-5 rounded-2xl p-5 border border-[#242424] bg-[#141414] text-left hover:border-zinc-600 transition-all duration-150 active:scale-[0.98]"
            >
              <span className="text-5xl leading-none select-none">{opt.emoji}</span>
              <p
                className="text-xl font-black leading-tight"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                {opt.label}
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Step 4: Success + Post ──────────────────────────────────────────
  if (step === 4) {
    const scoreCells = [
      { label: "Venue", display: venueDisplay, target: previewVenue },
      { label: "Artist", display: artistDisplay, target: previewArtist },
      { label: "Music", display: musicDisplay, target: previewMusic },
    ];

    return (
      <div
        key={animKey}
        className="flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300"
        style={{ minHeight: "calc(100svh - 5rem)" }}
      >
        <div className="pt-4 pb-2">
          <p className="text-zinc-500 text-xs font-semibold">{selected?.name}</p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center space-y-10">
          <div className="text-center space-y-2">
            <div className="text-4xl animate-in zoom-in duration-300">✨</div>
            <h1
              className="text-3xl font-black tracking-tight"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              Logged.
            </h1>
            <p className="text-zinc-500 text-sm">Community scores</p>
          </div>

          <div className="flex justify-around w-full max-w-xs">
            {scoreCells.map(({ label, display, target }) =>
              target !== null ? (
                <div key={label} className="flex flex-col items-center gap-2">
                  <span className="text-2xl">{scoreToEmoji(display)}</span>
                  <span
                    className="text-3xl font-black leading-none tabular-nums"
                    style={{ color: BRAND, fontFamily: "'Clash Display', sans-serif" }}
                  >
                    {display.toFixed(1)}
                  </span>
                  <span className="text-[11px] uppercase tracking-wider text-zinc-500 font-bold">
                    {label}
                  </span>
                </div>
              ) : null
            )}
          </div>
        </div>

        <div className="space-y-3 pb-4">
          {showNote && (
            <div className="space-y-3 animate-in slide-in-from-top-2 fade-in duration-200">
              <textarea
                rows={3}
                autoFocus
                placeholder="What made it memorable?"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-[#141414] border border-[#242424] rounded-xl p-4 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-500 resize-none"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 bg-[#141414] border border-dashed border-[#3f3f3f] rounded-xl text-sm text-zinc-400 hover:border-[#FF746C] hover:text-[#FF746C] transition-colors"
              >
                + Add photos or videos
              </button>
              {mediaFiles.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {mediaFiles.map((m, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-lg overflow-hidden bg-black"
                    >
                      {m.type === "image" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={m.previewUrl}
                          alt={m.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={m.previewUrl}
                          className="w-full h-full object-cover"
                          muted
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setMediaFiles((prev) => {
                            URL.revokeObjectURL(prev[i].previewUrl);
                            return prev.filter((_, idx) => idx !== i);
                          });
                        }}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full text-white text-xs flex items-center justify-center"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <button
            onClick={handlePost}
            className="w-full py-4 font-black text-base rounded-2xl transition-opacity hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: BRAND, color: "#000" }}
          >
            Post
          </button>

          {!showNote && (
            <button
              onClick={() => setShowNote(true)}
              className="w-full text-center text-sm text-zinc-600 hover:text-zinc-400 transition-colors py-1"
            >
              Add a note or photo
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
}
