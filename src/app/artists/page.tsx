import { artists } from "@/lib/data";
import { StarRating } from "@/components/StarRating";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function ArtistsPage() {
  const sorted = [...artists].sort((a, b) => b.liveRating - a.liveRating);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Artists</h1>
        <p className="text-zinc-400 text-sm mt-1">Ranked by live rating, not Spotify clout.</p>
      </div>
      <div className="space-y-3">
        {sorted.map((artist, i) => (
          <Link
            key={artist.slug}
            href={`/artists/${artist.slug}`}
            className="card-accent flex items-center gap-4 bg-[#141414] border border-[#242424] rounded-2xl p-4 hover:border-zinc-600 transition-colors"
          >
            <span className="text-zinc-600 font-black text-lg w-6 text-center">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-white font-bold">{artist.name}</p>
                {parseInt(artist.spotifyFollowers) < 100000 && artist.liveRating >= 4.7 && (
                  <Badge className="text-[10px]" style={{ backgroundColor: "rgba(255,116,108,0.1)", color: "#FF746C", border: "1px solid rgba(255,116,108,0.2)" }}>
                    Hidden Gem
                  </Badge>
                )}
              </div>
              <p className="text-zinc-500 text-xs mt-0.5">{artist.genres.join(" · ")}</p>
              <p className="text-zinc-600 text-xs mt-0.5">{artist.spotifyFollowers} Spotify followers</p>
            </div>
            <div className="text-right shrink-0">
              <StarRating rating={artist.liveRating} />
              <p className="text-zinc-500 text-xs mt-1">{artist.liveRatingCount} live reviews</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
