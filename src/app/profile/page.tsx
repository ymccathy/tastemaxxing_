import { reviews, events, getVenue } from "@/lib/data";
import { ReviewCard } from "@/components/ReviewCard";
import Link from "next/link";

const MY_REVIEWS = reviews.filter((r) => ["r1", "r5"].includes(r.id));
const BOOKMARKED_EVENTS = events.slice(0, 3);

const TASTE_PROFILE = [
  { genre: "Deep House", score: 92 },
  { genre: "Lo-fi House", score: 85 },
  { genre: "Disco", score: 78 },
  { genre: "Tech House", score: 61 },
  { genre: "Techno", score: 44 },
];

const BRAND = "#FF746C";

export default function ProfilePage() {
  const totalSpend = MY_REVIEWS
    .filter((r) => r.spend)
    .reduce((sum, r) => sum + parseInt(r.spend!.replace("$", "")), 0);

  return (
    <div className="space-y-8">
      {/* Profile header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-black font-black text-xl" style={{ backgroundColor: BRAND }}>
          YM
        </div>
        <div>
          <h1 className="text-2xl font-black">Your Profile</h1>
          <p className="text-zinc-400 text-sm">NYC · {MY_REVIEWS.length} reviews</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#141414] border border-[#242424] rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-white">{MY_REVIEWS.length}</p>
          <p className="text-zinc-500 text-xs mt-1">Reviews</p>
        </div>
        <div className="bg-[#141414] border border-[#242424] rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-white">{BOOKMARKED_EVENTS.length}</p>
          <p className="text-zinc-500 text-xs mt-1">Bookmarked</p>
        </div>
        <div className="bg-[#141414] border border-[#242424] rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-white">${totalSpend}</p>
          <p className="text-zinc-500 text-xs mt-1">Spent (tracked)</p>
        </div>
      </div>

      {/* Taste fingerprint */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Your Live Taste</h2>
        <p className="text-zinc-600 text-xs">Built from your reviews — not your Spotify.</p>
        <div className="space-y-2">
          {TASTE_PROFILE.map(({ genre, score }) => (
            <div key={genre} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-300">{genre}</span>
                <span className="text-zinc-500">{score}%</span>
              </div>
              <div className="h-2 bg-[#1f1f1f] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${score}%`, backgroundColor: BRAND }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-zinc-600 text-xs pt-1">
          You thought you were just tech house. Turns out you&apos;re deep house / disco first.
        </p>
      </section>

      {/* Bookmarked events */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Want to Go</h2>
        <div className="space-y-2">
          {BOOKMARKED_EVENTS.map((event) => {
            const venue = getVenue(event.venueSlug);
            return (
              <Link
                key={event.slug}
                href={`/events/${event.slug}`}
                className="card-accent flex items-center justify-between bg-[#141414] border border-[#242424] rounded-xl p-4 hover:border-zinc-600 transition-colors"
              >
                <div>
                  <p className="text-white font-semibold">{event.name}</p>
                  <p className="text-zinc-500 text-xs">{venue?.name} · {event.date}</p>
                </div>
                <p className="text-white font-semibold text-sm">{event.ticketPrice}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* My reviews */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Your Reviews</h2>
        {MY_REVIEWS.length > 0 ? (
          <div className="space-y-4">
            {MY_REVIEWS.map((r) => <ReviewCard key={r.id} review={r} />)}
          </div>
        ) : (
          <div className="bg-[#141414] border border-[#242424] rounded-xl p-6 text-center">
            <p className="text-zinc-500 text-sm">No reviews yet.</p>
            <Link href="/write-review" className="text-sm font-semibold mt-2 block hover:opacity-80" style={{ color: BRAND }}>
              Write your first →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
