import { Review } from "@/lib/data";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

function SubRating({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">{label}</span>
      <span className="text-white font-black text-base" style={{ fontFamily: "'Clash Display', sans-serif" }}>
        {value.toFixed(1)}
      </span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} style={{ fontSize: 8, color: i <= Math.round(value) ? "#FF746C" : "#3f3f3f" }}>●</span>
        ))}
      </div>
    </div>
  );
}

export function ReviewCard({ review }: { review: Review }) {
  const targetHref =
    review.type === "event"
      ? `/events/${review.eventSlug}`
      : review.type === "venue"
      ? `/venues/${review.venueSlug}`
      : `/artists/${review.targetSlug}`;

  const images = review.media?.filter((m) => m.type === "image") ?? [];
  const videos = review.media?.filter((m) => m.type === "video") ?? [];
  const hasSubRatings = review.djRating || review.crowdRating || review.venueRating;

  return (
    <div className="card-accent bg-[#141414] border border-[#242424] rounded-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9 shrink-0">
          <AvatarFallback className="bg-zinc-700 text-zinc-200 text-xs font-bold">
            {review.authorAvatar}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">{review.authorName}</p>
          <p className="text-xs text-zinc-500">{review.date}</p>
        </div>
        {/* Overall score */}
        <div className="flex flex-col items-end shrink-0">
          <span
            className="text-2xl font-black leading-none"
            style={{ color: "#FF746C", fontFamily: "'Clash Display', sans-serif" }}
          >
            {review.overallRating.toFixed(1)}
          </span>
          <span className="text-[10px] text-zinc-600 mt-0.5">/ 5</span>
        </div>
      </div>

      {/* Target */}
      <Link href={targetHref} className="block -mt-1">
        <p className="text-white font-semibold hover:text-[#FF746C] transition-colors">
          {review.targetName}
        </p>
        {review.venueName && review.type === "event" && (
          <p className="text-zinc-500 text-xs mt-0.5">{review.venueName}</p>
        )}
      </Link>

      {/* 3-part rating breakdown */}
      {hasSubRatings && (
        <div className="flex gap-4 py-3 border-y border-[#1f1f1f]">
          {review.djRating !== undefined && (
            <SubRating label="DJ" value={review.djRating} />
          )}
          {review.crowdRating !== undefined && (
            <SubRating label="Crowd" value={review.crowdRating} />
          )}
          {review.venueRating !== undefined && (
            <SubRating label="Venue" value={review.venueRating} />
          )}
          {review.worthIt !== null && (
            <div className="ml-auto flex items-center">
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={
                  review.worthIt
                    ? { backgroundColor: "rgba(255,116,108,0.15)", color: "#FF746C" }
                    : { backgroundColor: "rgba(239,68,68,0.1)", color: "#f87171" }
                }
              >
                {review.worthIt ? "Worth it" : "Skip"}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Review text */}
      <p className="text-zinc-300 text-sm leading-relaxed">{review.text}</p>

      {/* Media */}
      {(images.length > 0 || videos.length > 0) && (
        <div className="space-y-2">
          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-1.5">
              {images.map((m, i) => (
                <a key={i} href={m.url} target="_blank" rel="noopener noreferrer" className="block aspect-square overflow-hidden rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-200" />
                </a>
              ))}
            </div>
          )}
          {videos.map((m, i) => (
            <video key={i} src={m.url} controls className="w-full max-h-60 rounded-lg object-cover bg-black" />
          ))}
        </div>
      )}

      {/* Tags + spend */}
      <div className="flex items-center justify-between gap-2">
        {review.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {review.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs bg-[#1f1f1f] text-zinc-400 border-0">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
        {review.spend && (
          <p className="text-xs text-zinc-600 shrink-0">
            spent <span className="text-zinc-400 font-semibold">{review.spend}</span>
          </p>
        )}
      </div>
    </div>
  );
}
