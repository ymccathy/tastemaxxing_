import { venues } from "@/lib/data";
import { StarRating } from "@/components/StarRating";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const capacityLabel = { intimate: "Intimate", medium: "Mid-size", large: "Large", massive: "Massive" };

export default function VenuesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">NYC Venues</h1>
        <p className="text-zinc-400 text-sm mt-1">Real talk on bathrooms, drinks, subway, and vibes.</p>
      </div>
      <div className="space-y-3">
        {venues.map((venue) => (
          <Link
            key={venue.slug}
            href={`/venues/${venue.slug}`}
            className="card-accent block bg-[#141414] border border-[#242424] rounded-2xl p-5 hover:border-zinc-600 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-white font-bold text-lg">{venue.name}</p>
                  <Badge className="bg-[#1f1f1f] text-zinc-400 border-0 text-xs">{capacityLabel[venue.capacity]}</Badge>
                  <Badge className="bg-[#1f1f1f] text-zinc-400 border-0 text-xs">{venue.indoorOutdoor}</Badge>
                </div>
                <p className="text-zinc-500 text-sm mt-0.5">{venue.neighborhood}</p>
                <p className="text-zinc-400 text-xs mt-2 line-clamp-2">{venue.description}</p>
              </div>
              <div className="shrink-0 text-right">
                <StarRating rating={venue.overallRating} />
                <p className="text-zinc-500 text-xs mt-1">{venue.reviewCount} reviews</p>
              </div>
            </div>
            {/* Quick facts */}
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
              <div className="bg-[#1f1f1f] rounded-lg p-2 text-center">
                <p className="text-zinc-500">Subway</p>
                <p className="text-white font-semibold">{venue.subwayWalkMin}min walk</p>
              </div>
              <div className="bg-[#1f1f1f] rounded-lg p-2 text-center">
                <p className="text-zinc-500">Drinks</p>
                <p className="text-white font-semibold">{venue.avgDrinkPrice}</p>
              </div>
              <div className="bg-[#1f1f1f] rounded-lg p-2 text-center">
                <p className="text-zinc-500">Coat Check</p>
                <p className="text-white font-semibold">{venue.coatCheck}</p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {venue.crowdTags.map((tag) => (
                <Badge key={tag} className="text-[10px] bg-[#1f1f1f] text-zinc-400 border-0">#{tag}</Badge>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
