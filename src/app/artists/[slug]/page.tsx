import { getArtist, reviews, getUpcomingEventsForArtist, getVenue } from "@/lib/data";
import { StarRating } from "@/components/StarRating";
import { ReviewCard } from "@/components/ReviewCard";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const artist = getArtist(slug);
  if (!artist) notFound();

  const artistReviews = reviews.filter((r) => r.targetSlug === slug);
  const upcomingEvents = getUpcomingEventsForArtist(slug);
  const isHiddenGem = parseInt(artist.spotifyFollowers) < 100000 && artist.liveRating >= 4.7;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-3xl font-black tracking-tight">{artist.name}</h1>
              {isHiddenGem && (
                <Badge style={{ backgroundColor: "rgba(255,116,108,0.1)", color: "#FF746C", border: "1px solid rgba(255,116,108,0.2)" }}>
                  Hidden Gem
                </Badge>
              )}
            </div>
            <p className="text-zinc-400 mt-1">{artist.hometown}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="flex flex-col items-end gap-1">
              <StarRating rating={artist.liveRating} size="lg" />
              <p className="text-zinc-500 text-xs">{artist.liveRatingCount} live reviews</p>
              <p className="text-zinc-600 text-xs">{artist.spotifyFollowers} on Spotify</p>
            </div>
          </div>
        </div>

        {/* Live vs Spotify divergence callout */}
        {isHiddenGem && (
          <div className="mt-4 rounded-xl p-4" style={{ backgroundColor: "rgba(255,116,108,0.05)", border: "1px solid rgba(255,116,108,0.2)" }}>
            <p className="text-sm font-semibold" style={{ color: "#FF746C" }}>
              Live &gt; Spotify 🔊
            </p>
            <p className="text-zinc-400 text-xs mt-1">
              Only {artist.spotifyFollowers} Spotify followers but rated {artist.liveRating}/5 live by {artist.liveRatingCount} people. This is exactly who you should see.
            </p>
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-1.5">
          {artist.genres.map((g) => (
            <Badge key={g} className="bg-[#1f1f1f] text-zinc-300 border-0">{g}</Badge>
          ))}
        </div>
        <p className="text-zinc-300 mt-3 text-sm leading-relaxed">{artist.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {artist.tags.map((tag) => (
            <Badge key={tag} className="bg-[#1f1f1f] text-zinc-400 border-0 text-xs">#{tag}</Badge>
          ))}
        </div>
      </div>

      <Separator className="bg-[#242424]" />

      {/* Upcoming events */}
      {upcomingEvents.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Upcoming in NYC</h2>
          <div className="space-y-2">
            {upcomingEvents.map((event) => {
              const venue = getVenue(event.venueSlug);
              return (
                <Link
                  key={event.slug}
                  href={`/events/${event.slug}`}
                  className="card-accent flex items-center justify-between bg-[#141414] border border-[#242424] rounded-xl p-4 hover:border-zinc-600 transition-colors"
                >
                  <div>
                    <p className="text-white font-semibold">{event.name}</p>
                    <p className="text-zinc-500 text-xs">{venue?.name} · {event.date} · {event.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold text-sm">{event.ticketPrice}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Reviews */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Live Reviews</h2>
          <Link href="/write-review" className="text-xs font-semibold hover:opacity-80 transition-opacity" style={{ color: "#FF746C" }}>
            + Write one
          </Link>
        </div>
        {artistReviews.length > 0 ? (
          <div className="space-y-4">
            {artistReviews.map((r) => <ReviewCard key={r.id} review={r} />)}
          </div>
        ) : (
          <p className="text-zinc-600 text-sm">No reviews yet. Be the first.</p>
        )}
      </section>
    </div>
  );
}
