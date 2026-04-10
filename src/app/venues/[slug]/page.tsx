import { getVenue, reviews, getUpcomingEventsForVenue } from "@/lib/data";
import { StarRating } from "@/components/StarRating";
import { ReviewCard } from "@/components/ReviewCard";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function VenuePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const venue = getVenue(slug);
  if (!venue) notFound();

  const venueReviews = reviews.filter((r) => r.venueSlug === slug);
  const upcomingEvents = getUpcomingEventsForVenue(slug);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight">{venue.name}</h1>
            <p className="text-zinc-400 mt-1">{venue.neighborhood}</p>
          </div>
          <div className="text-right">
            <StarRating rating={venue.overallRating} size="lg" />
            <p className="text-zinc-500 text-xs mt-1">{venue.reviewCount} reviews</p>
          </div>
        </div>
        <p className="text-zinc-300 mt-3 text-sm leading-relaxed">{venue.description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {venue.crowdTags.map((tag) => (
            <Badge key={tag} className="bg-[#1f1f1f] text-zinc-400 border-0">#{tag}</Badge>
          ))}
        </div>
      </div>

      {/* Practical info grid */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Before You Go</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#141414] border border-[#242424] rounded-xl p-4 space-y-0.5">
            <p className="text-zinc-500 text-xs">Subway</p>
            <p className="text-white font-semibold text-sm">{venue.subway}</p>
            <p className="text-zinc-400 text-xs">{venue.subwayWalkMin} min walk</p>
          </div>
          <div className="bg-[#141414] border border-[#242424] rounded-xl p-4 space-y-0.5">
            <p className="text-zinc-500 text-xs">Drinks</p>
            <p className="text-white font-semibold text-sm">{venue.avgDrinkPrice}</p>
            <p className="text-zinc-400 text-xs">{venue.cashOnly ? "Cash only" : "Card accepted"}</p>
          </div>
          <div className="bg-[#141414] border border-[#242424] rounded-xl p-4 space-y-0.5">
            <p className="text-zinc-500 text-xs">Coat Check</p>
            <p className="text-white font-semibold text-sm">{venue.coatCheck}</p>
          </div>
          <div className="bg-[#141414] border border-[#242424] rounded-xl p-4 space-y-0.5">
            <p className="text-zinc-500 text-xs">Set Times</p>
            <p className="text-white font-semibold text-sm">{venue.typicalDoorsDelay}</p>
          </div>
          <div className="bg-[#141414] border border-[#242424] rounded-xl p-4 space-y-0.5">
            <p className="text-zinc-500 text-xs">Bathrooms</p>
            <StarRating rating={venue.bathroomRating} size="sm" />
            <p className="text-zinc-400 text-xs">{venue.bathroomRating}/5</p>
          </div>
          <div className="bg-[#141414] border border-[#242424] rounded-xl p-4 space-y-0.5">
            <p className="text-zinc-500 text-xs">Capacity</p>
            <p className="text-white font-semibold text-sm">~{venue.capacityNum.toLocaleString()}</p>
            <p className="text-zinc-400 text-xs">{venue.indoorOutdoor}</p>
          </div>
        </div>
        <div className="bg-[#141414] border border-[#242424] rounded-xl p-4">
          <p className="text-zinc-500 text-xs">Dress Code</p>
          <p className="text-white font-semibold text-sm mt-0.5">{venue.dresscode}</p>
        </div>
        {venue.stages.length > 1 && (
          <div className="bg-[#141414] border border-[#242424] rounded-xl p-4">
            <p className="text-zinc-500 text-xs mb-2">Stages / Rooms</p>
            <div className="flex flex-wrap gap-2">
              {venue.stages.map((s) => (
                <Badge key={s} className="bg-[#1f1f1f] text-zinc-300 border-0">{s}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      <Separator className="bg-[#242424]" />

      {/* Upcoming events */}
      {upcomingEvents.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Upcoming at {venue.name}</h2>
          <div className="space-y-2">
            {upcomingEvents.map((event) => (
              <Link
                key={event.slug}
                href={`/events/${event.slug}`}
                className="card-accent flex items-center justify-between bg-[#141414] border border-[#242424] rounded-xl p-4 hover:border-zinc-600 transition-colors"
              >
                <div>
                  <p className="text-white font-semibold">{event.name}</p>
                  <p className="text-zinc-500 text-xs">{event.date} · {event.time}</p>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {event.genres.map((g) => (
                      <Badge key={g} className="text-[10px] bg-[#1f1f1f] text-zinc-400 border-0">{g}</Badge>
                    ))}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-white font-semibold text-sm">{event.ticketPrice}</p>
                  {event.worthItScore > 0 && (
                    <p className="text-green-400 text-xs">{event.worthItScore}% worth it</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Photos & Videos */}
      {(() => {
        const allMedia = venueReviews.flatMap((r) =>
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
        {venueReviews.length > 0 ? (
          <div className="space-y-4">
            {venueReviews.map((r) => <ReviewCard key={r.id} review={r} />)}
          </div>
        ) : (
          <p className="text-zinc-600 text-sm">No reviews yet. Be the first.</p>
        )}
      </section>
    </div>
  );
}
