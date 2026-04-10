import Link from "next/link";

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur border-b border-[#242424]" style={{ backgroundColor: "#0A0A0A" }}>
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-white font-black text-lg tracking-tight" style={{ fontFamily: "'Clash Display', sans-serif" }}>
          tastemaxing
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/venues" className="text-zinc-400 hover:text-white transition-colors">
            Venues
          </Link>
          <Link href="/artists" className="text-zinc-400 hover:text-white transition-colors">
            Artists
          </Link>
          <Link href="/write-review" className="font-bold px-4 py-1.5 rounded-full text-xs transition-colors text-black hover:opacity-90" style={{ backgroundColor: "#FF746C" }}>
            + Review
          </Link>
          <Link href="/profile" className="text-zinc-400 hover:text-white transition-colors">
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
}
