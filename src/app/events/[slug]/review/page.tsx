"use client";
import { use, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { events, getVenue } from "@/lib/data";
import { DimensionRating, saveEventReview } from "@/lib/event-reviews";

const BRAND = "#FF746C";

const OPTIONS: { value: DimensionRating; emoji: string; label: string; sub: string }[] = [
  { value: "loved", emoji: "🔥", label: "Loved it", sub: "one of the best" },
  { value: "fine", emoji: "😐", label: "It was fine", sub: "decent, not special" },
  { value: "skip", emoji: "💀", label: "Skip it", sub: "wouldn't bother again" },
];

const STEPS: { key: "venueRating" | "artistRating" | "musicRating"; label: string; question: string }[] = [
  { key: "venueRating", label: "Venue", question: "How was the venue?" },
  { key: "artistRating", label: "Artist", question: "How was the artist?" },
  { key: "musicRating", label: "Music", question: "How was the music?" },
];

type Ratings = {
  venueRating: DimensionRating | null;
  artistRating: DimensionRating | null;
  musicRating: DimensionRating | null;
};

type MediaFile = { previewUrl: string; type: "image" | "video"; name: string };

function RatingCard({
  option,
  selected,
  onSelect,
}: {
  option: (typeof OPTIONS)[0];
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full flex items-center gap-5 rounded-2xl p-5 border transition-all duration-150 text-left"
      style={
        selected
          ? {
              backgroundColor: "rgba(255,116,108,0.08)",
              borderColor: "rgba(255,116,108,0.5)",
            }
          : {
              backgroundColor: "#141414",
              borderColor: "#242424",
            }
      }
    >
      <span className="text-5xl leading-none select-none">{option.emoji}</span>
      <div>
        <p
          className="text-lg font-black leading-tight"
          style={{ color: selected ? BRAND : "#fff", fontFamily: "'Clash Display', sans-serif" }}
        >
          {option.label}
        </p>
        <p className="text-zinc-500 text-sm mt-0.5">{option.sub}</p>
      </div>
      {selected && (
        <div
          className="ml-auto w-5 h-5 rounded-full flex items-center justify-center shrink-0"
          style={{ backgroundColor: BRAND }}
        >
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4L3.5 6.5L9 1" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </button>
  );
}

function ProgressDots({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((s, i) => (
        <div key={s.key} className="flex items-center gap-2">
          <div
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i < step ? 24 : i === step ? 32 : 16,
              backgroundColor:
                i < step ? BRAND : i === step ? BRAND : "#242424",
              opacity: i > step ? 0.4 : 1,
            }}
          />
        </div>
      ))}
      <div
        className="h-1.5 rounded-full transition-all duration-300"
        style={{
          width: step === 3 ? 32 : 16,
          backgroundColor: step === 3 ? BRAND : "#242424",
          opacity: step < 3 ? 0.4 : 1,
        }}
      />
    </div>
  );
}

export default function ReviewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();

  const event = events.find((e) => e.slug === slug);
  const venue = event ? getVenue(event.venueSlug) : undefined;

  const [step, setStep] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [ratings, setRatings] = useState<Ratings>({
    venueRating: null,
    artistRating: null,
    musicRating: null,
  });
  const [note, setNote] = useState("");
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [posted, setPosted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!event) {
    return (
      <div className="text-center py-20 space-y-3">
        <p className="text-zinc-400">Event not found.</p>
      </div>
    );
  }

  function pick(key: "venueRating" | "artistRating" | "musicRating", value: DimensionRating) {
    const updated = { ...ratings, [key]: value };
    setRatings(updated);
    setTimeout(() => {
      setAnimKey((k) => k + 1);
      setStep((s) => s + 1);
    }, 350);
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

  function removeMedia(i: number) {
    setMediaFiles((prev) => {
      URL.revokeObjectURL(prev[i].previewUrl);
      return prev.filter((_, idx) => idx !== i);
    });
  }

  function handlePost() {
    saveEventReview({
      id: `er-${Date.now()}`,
      eventSlug: slug,
      venueRating: ratings.venueRating!,
      artistRating: ratings.artistRating!,
      musicRating: ratings.musicRating!,
      note: note.trim() || undefined,
      media: mediaFiles.map((m) => ({ type: m.type, url: m.previewUrl })),
      date: new Date().toISOString(),
    });
    setPosted(true);
  }

  if (posted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6 text-center">
        <div className="text-6xl animate-in zoom-in duration-300">🎉</div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black" style={{ fontFamily: "'Clash Display', sans-serif" }}>
            Review posted.
          </h2>
          <p className="text-zinc-400 text-sm">Thanks for keeping the scene honest.</p>
        </div>
        <button
          onClick={() => router.push(`/events/${slug}`)}
          className="px-6 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-80"
          style={{ backgroundColor: BRAND, color: "#000" }}
        >
          Back to event →
        </button>
      </div>
    );
  }

  const currentStep = STEPS[step];

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <p className="text-xs text-zinc-500 font-semibold uppercase tracking-widest">
            {event.name}
          </p>
          {venue && <p className="text-zinc-600 text-xs">{venue.name}</p>}
        </div>
        <button
          onClick={() => router.push(`/events/${slug}`)}
          className="text-zinc-500 text-sm hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>

      {/* Progress */}
      <ProgressDots step={step} />

      {/* Step content */}
      {step < 3 ? (
        <div
          key={animKey}
          className="animate-in slide-in-from-right-8 fade-in duration-200 space-y-6"
        >
          {/* Step label */}
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: BRAND }}>
              {currentStep.label} · {step + 1} of 3
            </p>
            <h1 className="text-3xl font-black tracking-tight" style={{ fontFamily: "'Clash Display', sans-serif" }}>
              {currentStep.question}
            </h1>
          </div>

          {/* Rating cards */}
          <div className="space-y-3 pt-2">
            {OPTIONS.map((opt) => (
              <RatingCard
                key={opt.value}
                option={opt}
                selected={ratings[currentStep.key] === opt.value}
                onSelect={() => pick(currentStep.key, opt.value)}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Summary step */
        <div
          key={animKey}
          className="animate-in slide-in-from-right-8 fade-in duration-200 space-y-8"
        >
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: BRAND }}>
              Summary
            </p>
            <h1 className="text-3xl font-black tracking-tight" style={{ fontFamily: "'Clash Display', sans-serif" }}>
              How&apos;d it go?
            </h1>
          </div>

          {/* Recap row */}
          <div className="grid grid-cols-3 gap-2">
            {STEPS.map((s, i) => {
              const val = ratings[s.key];
              const opt = OPTIONS.find((o) => o.value === val);
              return (
                <button
                  key={s.key}
                  onClick={() => { setAnimKey((k) => k + 1); setStep(i); }}
                  className="bg-[#141414] border border-[#242424] rounded-xl p-3 text-center hover:border-zinc-600 transition-colors group"
                >
                  <p className="text-2xl">{opt?.emoji}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1">{s.label}</p>
                  <p className="text-xs text-zinc-400 mt-0.5 leading-tight">{opt?.label}</p>
                  <p className="text-[10px] text-zinc-700 mt-1 group-hover:text-zinc-500 transition-colors">tap to change</p>
                </button>
              );
            })}
          </div>

          {/* Note */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Note <span className="text-zinc-700 normal-case font-normal">optional</span>
            </p>
            <textarea
              rows={4}
              placeholder="what made it memorable?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-[#141414] border border-[#242424] rounded-xl p-4 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-500 resize-none"
            />
          </div>

          {/* Photos */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Photos <span className="text-zinc-700 normal-case font-normal">optional</span>
            </p>
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
                  <div key={i} className="relative group aspect-square rounded-lg overflow-hidden bg-black">
                    {m.type === "image" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.previewUrl} alt={m.name} className="w-full h-full object-cover" />
                    ) : (
                      <video src={m.previewUrl} className="w-full h-full object-cover" muted />
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

          {/* Post */}
          <button
            onClick={handlePost}
            className="w-full py-4 font-black text-base rounded-2xl transition-opacity hover:opacity-90"
            style={{ backgroundColor: BRAND, color: "#000" }}
          >
            Post
          </button>
        </div>
      )}
    </div>
  );
}
