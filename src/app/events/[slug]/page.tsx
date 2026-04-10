import { getEvent, getVenue, getArtist, reviews } from "@/lib/data";
import { StarRating } from "@/components/StarRating";
import { ReviewCard } from "@/components/ReviewCard";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = getEvent(slug);
  if (!event) notFound();

  const venue = getVenue(event.venueSlug);
  const lineupArtists = event.lineup.map(getArtist).filter(Boolean);
  const eventReviews = reviews.filter((r) => r.eventSlug === slug);

  const ticketMin = parseInt(event.ticketPrice.replace(/[^0-9–-]/g, "").split(/[–-]/)[0]);
  const drinkMin = venue ? parseInt(venue.avgDrinkPrice.replace(/[^0-9]/g, "").slice(0, 2)) : 14;
  const estimatedSpend = `$${ticketMin + drinkMin * 3 + 10 + 20}–${ticketMin + 20 + drinkMin * 5 + 10 + 20}`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {event.genres.map((g) => (
            <Badge key={g} className="bg-[#1f1f1f] text-zinc-400 border-0 text-xs">{g}</Badge>
          ))}
        </div>
        <h1 className="text-3xl font-black tracking-tight">{event.name}</h1>
        {venue && (
          <Link href={`/venues/${venue.slug}`} className="text-zinc-400 hover:text-white transition-colors mt-1 block">
            {venue.name} · {venue.neighborhood}
          </Link>
        )}
        <p className="text-zinc-500 text-sm mt-0.5">{event.date} · Doors {event.time}</p>
      </div>

      {/* Worth it + ticket */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#141414] border border-[#242424] rounded-xl p-4 text-center">
          <p className="text-zinc-500 text-xs">Ticket</p>
          <p className="text-white font-black text-xl mt-1">{event.ticketPrice}</p>
          <a href={event.ticketUrl} className="text-xs mt-1 block hover:opacity-80 transition-opacity" style={{ color: "#FF746C" }}>
            Get tickets →
          </a>
        </div>
        <div className="bg-[#141414] border border-[#242424] rounded-xl p-4 text-center">
          <p className="text-zinc-500 text-xs">Est. Total Spend</p>
          <p className="text-white font-black text-xl mt-1">{estimatedSpend}</p>
          <p className="text-zinc-600 text-xs mt-1">ticket + drinks + transport</p>
        </div>
      </div>

      {/* Worth it score */}
      {event.worthItScore > 0 && (
        <div className="bg-[#141414] border border-[#242424] rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-zinc-500 text-xs">Community verdict</p>
            <p className="text-white font-bold mt-0.5">
              <span className={event.worthItScore >= 75 ? "text-green-400" : event.worthItScore >= 50 ? "text-[#FF746C]" : "text-red-400"}>
                {event.worthItScore}%
              </span>{" "}
              say worth it
            </p>
          </div>
          <p className="text-zinc-600 text-xs">{event.worthItVotes} votes</p>
        </div>
      )}

      <Separator className="bg-[#242424]" />

      {/* Lineup */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Lineup</h2>
        <div className="space-y-2">
          {lineupArtists.map((artist) => artist && (
            <Link
              key={artist.slug}
              href={`/artists/${artist.slug}`}
              className="card-accent flex items-center justify-between bg-[#141414] border border-[#242424] rounded-xl p-4 hover:border-zinc-600 transition-colors"
            >
              <div>
                <p className="text-white font-semibold">{artist.name}</p>
                <p className="text-zinc-500 text-xs">{artist.genres.join(" · ")}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {artist.tags.slice(0, 2).map((t) => (
                    <Badge key={t} className="text-[10px] bg-[#1f1f1f] text-zinc-400 border-0">#{t}</Badge>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <StarRating rating={artist.liveRating} />
                <p className="text-zinc-500 text-xs mt-1">{artist.liveRatingCount} live reviews</p>
                {parseInt(artist.spotifyFollowers) < 100000 && artist.liveRating >= 4.7 && (
                  <Badge className="mt-1 text-[10px]" style={{ backgroundColor: "rgba(255,116,108,0.1)", color: "#FF746C", border: "1px solid rgba(255,116,108,0.2)" }}>
                    Hidden Gem
                  </Badge>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Venue quick facts */}
      {venue && (
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Venue Intel</h2>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-[#141414] border border-[#242424] rounded-lg p-3">
              <p className="text-zinc-500">Subway</p>
              <p className="text-white font-semibold">{venue.subway}</p>
              <p className="text-zinc-400">{venue.subwayWalkMin}min walk</p>
            </div>
            <div className="bg-[#141414] border border-[#242424] rounded-lg p-3">
              <p className="text-zinc-500">Drinks</p>
              <p className="text-white font-semibold">{venue.avgDrinkPrice}</p>
              <p className="text-zinc-400">{venue.cashOnly ? "Cash only" : "Card OK"}</p>
            </div>
            <div className="bg-[#141414] border border-[#242424] rounded-lg p-3">
              <p className="text-zinc-500">Coat Check</p>
              <p className="text-white font-semibold">{venue.coatCheck}</p>
            </div>
            <div className="bg-[#141414] border border-[#242424] rounded-lg p-3">
              <p className="text-zinc-500">Set Times</p>
              <p className="text-white font-semibold">{venue.typicalDoorsDelay}</p>
            </div>
          </div>
          <Link href={`/venues/${venue.slug}`} className="text-zinc-500 text-xs hover:text-white transition-colors">
            Full venue profile →
          </Link>
        </section>
      )}

      <Separator className="bg-[#242424]" />

      {/* Photos & Videos */}
      {(() => {
        const allMedia = eventReviews.flatMap((r) =>
          (r.media ?? []).map((m) => ({ ...m, authorName: r.authorName, reviewId: r.id }))
        );
        if (allMedia.length === 0) return null;
        return (
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Photos & Videos</h2>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
              {allMedia.map((m, i) => (
                <div key={i} className="shrink-0 space-y-1">
                  {m.type === "image" ? (
                    <a href={m.url} target="_blank" rel="noopener noreferrer" className="block w-36 h-36 rounded-xl overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={m.url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-200" />
                    </a>
                  ) : (
                    <video src={m.url} muted autoPlay loop className="w-48 h-36 rounded-xl object-cover" />
                  )}
                  <p className="text-[10px] text-zinc-600 pl-1">{m.authorName}</p>
                </div>
              ))}
            </div>
          </section>
        );
      })()}

      {/* Reviews */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Reviews</h2>
          <Link href="/write-review" className="text-xs font-semibold hover:opacity-80 transition-opacity" style={{ color: "#FF746C" }}>
            + Write one
          </Link>
        </div>
        {eventReviews.length > 0 ? (
          <div className="space-y-4">
            {eventReviews.map((r) => <ReviewCard key={r.id} review={r} />)}
          </div>
        ) : (
          <p className="text-zinc-600 text-sm">No reviews yet. Be the first.</p>
        )}
      </section>
    </div>
  );
}
