export type DimensionRating = "loved" | "fine" | "skip";

export type EventReview = {
  id: string;
  eventSlug: string;
  venueRating: DimensionRating;
  artistRating: DimensionRating;
  musicRating: DimensionRating;
  note?: string;
  media?: { type: "image" | "video"; url: string }[];
  date: string;
};

const KEY = "tm_event_reviews";

export function ratingToScore(r: DimensionRating): number {
  return r === "loved" ? 5 : r === "fine" ? 3 : 1;
}

export function scoreToEmoji(score: number): string {
  if (score >= 4.5) return "🔥";
  if (score >= 2.5) return "😐";
  return "💀";
}

export function getEventReviews(): EventReview[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveEventReview(review: EventReview): void {
  const all = getEventReviews();
  localStorage.setItem(KEY, JSON.stringify([review, ...all]));
}

export type DimensionScores = {
  venue: number | null;
  artist: number | null;
  music: number | null;
  count: number;
};

export function getEventAvgScores(slug: string): DimensionScores {
  const all = getEventReviews().filter((r) => r.eventSlug === slug);
  if (all.length === 0) return { venue: null, artist: null, music: null, count: 0 };

  const avg = (key: "venueRating" | "artistRating" | "musicRating") => {
    const scores = all.map((r) => ratingToScore(r[key]));
    return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
  };

  return {
    venue: avg("venueRating"),
    artist: avg("artistRating"),
    music: avg("musicRating"),
    count: all.length,
  };
}
