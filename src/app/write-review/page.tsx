"use client";
import { useState, useRef } from "react";
import { events, venues, artists, computeOverall } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

type MediaFile = { previewUrl: string; type: "image" | "video"; name: string };

const TAGS = [
  "arrive-early", "stay-till-close", "worth-double", "overpriced", "hidden-gem",
  "must-see", "vinyl-only", "crowd-was-incredible", "tourist-crowd", "intimate",
  "peak-hour-magic", "good-sound", "earplugs-required", "no-phones-vibe", "b2b",
  "skip-coat-check", "go-sober", "buy-the-ticket", "arrive-late", "surprise-guest",
];

const BRAND = "#FF746C";

function StarPicker({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-zinc-300 text-sm font-semibold w-16">{label}</span>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className="w-9 h-9 rounded-xl font-bold text-sm transition-all"
            style={
              n <= value
                ? { backgroundColor: BRAND, color: "#000" }
                : { backgroundColor: "#1f1f1f", color: "#555" }
            }
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function WriteReviewPage() {
  const [reviewType, setReviewType] = useState<"event" | "venue" | "artist">("event");
  const [selectedTarget, setSelectedTarget] = useState("");
  const [djRating, setDjRating] = useState(0);
  const [crowdRating, setCrowdRating] = useState(0);
  const [venueRating, setVenueRating] = useState(0);
  const [worthIt, setWorthIt] = useState<boolean | null>(null);
  const [text, setText] = useState("");
  const [spend, setSpend] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const overall = computeOverall(
    reviewType !== "venue" && djRating ? djRating : undefined,
    crowdRating || undefined,
    reviewType !== "artist" && venueRating ? venueRating : undefined,
  );

  const targets =
    reviewType === "event"
      ? events.map((e) => ({ slug: e.slug, name: `${e.name} @ ${venues.find((v) => v.slug === e.venueSlug)?.name} (${e.date})` }))
      : reviewType === "venue"
      ? venues.map((v) => ({ slug: v.slug, name: v.name }))
      : artists.map((a) => ({ slug: a.slug, name: a.name }));

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
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

  function removeMedia(index: number) {
    setMediaFiles((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  }

  if (submitted) {
    return (
      <div className="text-center space-y-4 py-20">
        <p className="text-4xl">🎉</p>
        <h2 className="text-2xl font-black" style={{ fontFamily: "'Clash Display', sans-serif" }}>
          Review logged.
        </h2>
        <p className="text-zinc-400 text-sm">Thanks for helping the community spend their money right.</p>
        <button
          onClick={() => {
            setSubmitted(false); setSelectedTarget(""); setText("");
            setDjRating(0); setCrowdRating(0); setVenueRating(0);
            setWorthIt(null); setSelectedTags([]); setMediaFiles([]);
          }}
          className="text-sm font-semibold hover:opacity-80"
          style={{ color: BRAND }}
        >
          Write another →
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-4">
      <h1 className="text-2xl font-black tracking-tight pt-2" style={{ fontFamily: "'Clash Display', sans-serif" }}>
        Write a Review
      </h1>

      {/* Review type */}
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Reviewing a…</p>
        <div className="flex gap-2">
          {(["event", "venue", "artist"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setReviewType(t); setSelectedTarget(""); setDjRating(0); setCrowdRating(0); setVenueRating(0); }}
              className="px-4 py-2 rounded-full text-sm font-semibold transition-colors capitalize"
              style={
                reviewType === t
                  ? { backgroundColor: BRAND, color: "#000" }
                  : { backgroundColor: "#1f1f1f", color: "#9ca3af" }
              }
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Target */}
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Which one?</p>
        <select
          value={selectedTarget}
          onChange={(e) => setSelectedTarget(e.target.value)}
          className="w-full bg-[#141414] border border-[#242424] rounded-xl p-3 text-white text-sm focus:outline-none focus:border-zinc-500"
        >
          <option value="">Select a {reviewType}…</option>
          {targets.map((t) => (
            <option key={t.slug} value={t.slug}>{t.name}</option>
          ))}
        </select>
      </div>

      {/* ── 3-part rating ─────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Rate the Experience</p>
          {overall > 0 && (
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black" style={{ color: BRAND, fontFamily: "'Clash Display', sans-serif" }}>
                {overall.toFixed(1)}
              </span>
              <span className="text-zinc-600 text-sm">/ 5</span>
            </div>
          )}
        </div>

        <div className="bg-[#141414] border border-[#242424] rounded-2xl p-5 space-y-4">
          {reviewType !== "venue" && (
            <StarPicker label="DJ" value={djRating} onChange={setDjRating} />
          )}
          <StarPicker label="Crowd" value={crowdRating} onChange={setCrowdRating} />
          {reviewType !== "artist" && (
            <StarPicker label="Venue" value={venueRating} onChange={setVenueRating} />
          )}

          {/* Live overall bar */}
          {overall > 0 && (
            <div className="pt-3 border-t border-[#242424]">
              <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
                <span>Overall</span>
                <span style={{ color: BRAND }}>{overall.toFixed(1)} / 5</span>
              </div>
              <div className="h-2 bg-[#1f1f1f] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${(overall / 5) * 100}%`, backgroundColor: BRAND }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Worth it */}
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Worth it?</p>
        <div className="flex gap-3">
          <button
            onClick={() => setWorthIt(true)}
            className="flex-1 py-3 rounded-xl font-semibold text-sm transition-colors"
            style={worthIt === true ? { backgroundColor: "#22c55e", color: "#fff" } : { backgroundColor: "#1f1f1f", color: "#9ca3af" }}
          >
            Worth it
          </button>
          <button
            onClick={() => setWorthIt(false)}
            className="flex-1 py-3 rounded-xl font-semibold text-sm transition-colors"
            style={worthIt === false ? { backgroundColor: "#ef4444", color: "#fff" } : { backgroundColor: "#1f1f1f", color: "#9ca3af" }}
          >
            Skip
          </button>
        </div>
      </div>

      {/* Spend */}
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Total spend <span className="text-zinc-700 normal-case font-normal">optional</span></p>
        <input
          type="text"
          placeholder="e.g. $85"
          value={spend}
          onChange={(e) => setSpend(e.target.value)}
          className="w-full bg-[#141414] border border-[#242424] rounded-xl p-3 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
        />
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Tags</p>
        <div className="flex flex-wrap gap-2">
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className="text-xs px-3 py-1.5 rounded-full transition-colors"
              style={
                selectedTags.includes(tag)
                  ? { backgroundColor: BRAND, color: "#000", fontWeight: 600 }
                  : { backgroundColor: "#1f1f1f", color: "#9ca3af" }
              }
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* Review text */}
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Your review</p>
        <textarea
          rows={4}
          placeholder="What was the set like? Is it worth the trip?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-[#141414] border border-[#242424] rounded-xl p-4 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-500 resize-none"
        />
      </div>

      {/* Photos & Videos */}
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Photos & Videos</p>
        <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleFileChange} />
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
              <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-black">
                {m.type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.previewUrl} alt={m.name} className="w-full h-full object-cover" />
                ) : (
                  <video src={m.previewUrl} className="w-full h-full object-cover" muted />
                )}
                {m.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-white text-2xl opacity-80">▶</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeMedia(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        disabled={!selectedTarget || overall === 0 || !text.trim()}
        onClick={() => setSubmitted(true)}
        className="w-full py-4 font-black text-base rounded-2xl transition-opacity disabled:opacity-25 disabled:cursor-not-allowed hover:opacity-90"
        style={{ backgroundColor: BRAND, color: "#000" }}
      >
        Post Review
      </button>
    </div>
  );
}
