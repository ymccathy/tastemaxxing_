"use client";
import { useEffect, useState } from "react";
import { getEventAvgScores, DimensionScores, scoreToEmoji } from "@/lib/event-reviews";
import Link from "next/link";

const BRAND = "#FF746C";

function ScoreCell({ label, score }: { label: string; score: number | null }) {
  if (score === null) return null;
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xl leading-none">{scoreToEmoji(score)}</span>
      <span
        className="text-base font-black leading-none"
        style={{ color: BRAND, fontFamily: "'Clash Display', sans-serif" }}
      >
        {score.toFixed(1)}
      </span>
      <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">{label}</span>
    </div>
  );
}

type Props = {
  eventSlug: string;
  predictedVenue?: number;
  predictedArtist?: number;
  predictedMusic?: number;
};

export function EventReviewScores({
  eventSlug,
  predictedVenue,
  predictedArtist,
  predictedMusic,
}: Props) {
  const [scores, setScores] = useState<DimensionScores>({
    venue: null,
    artist: null,
    music: null,
    count: 0,
  });

  useEffect(() => {
    setScores(getEventAvgScores(eventSlug));
  }, [eventSlug]);

  if (scores.count === 0) {
    // Show predicted score if available
    if (predictedVenue !== undefined && predictedArtist !== undefined) {
      return (
        <div className="bg-[#141414] border border-[#242424] rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-zinc-500 text-xs">Predicted Score</p>
              <p className="text-zinc-600 text-[11px] mt-0.5">Based on past performance</p>
            </div>
            <Link
              href={`/events/${eventSlug}/review`}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl transition-opacity hover:opacity-80"
              style={{ backgroundColor: BRAND, color: "#000" }}
            >
              Rate it
            </Link>
          </div>
          <div className="flex justify-around border-t border-[#1f1f1f] pt-3">
            <ScoreCell label="Venue" score={predictedVenue} />
            <div className="w-px bg-[#1f1f1f]" />
            <ScoreCell label="Artist" score={predictedArtist} />
            <div className="w-px bg-[#1f1f1f]" />
            <ScoreCell label="Music" score={predictedMusic ?? predictedArtist} />
          </div>
        </div>
      );
    }

    return (
      <div className="bg-[#141414] border border-[#242424] rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-zinc-500 text-xs">Community scores</p>
          <p className="text-zinc-600 text-sm mt-0.5">No reviews yet</p>
        </div>
        <Link
          href={`/events/${eventSlug}/review`}
          className="text-sm font-semibold px-4 py-2 rounded-xl transition-opacity hover:opacity-80"
          style={{ backgroundColor: BRAND, color: "#000" }}
        >
          Rate it
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#141414] border border-[#242424] rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-zinc-500 text-xs">Community scores</p>
        <div className="flex items-center gap-3">
          <p className="text-zinc-600 text-xs">
            {scores.count} {scores.count === 1 ? "review" : "reviews"}
          </p>
          <Link
            href={`/events/${eventSlug}/review`}
            className="text-xs font-semibold hover:opacity-80 transition-opacity"
            style={{ color: BRAND }}
          >
            + Rate it
          </Link>
        </div>
      </div>
      <div className="flex justify-around border-t border-[#1f1f1f] pt-3">
        <ScoreCell label="Venue" score={scores.venue} />
        <div className="w-px bg-[#1f1f1f]" />
        <ScoreCell label="Artist" score={scores.artist} />
        <div className="w-px bg-[#1f1f1f]" />
        <ScoreCell label="Music" score={scores.music} />
      </div>
    </div>
  );
}
