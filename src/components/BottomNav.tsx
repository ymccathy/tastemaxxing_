"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BottomNav() {
  const path = usePathname();

  const tab = (href: string, label: string, icon: React.ReactNode) => {
    const active = path === href;
    return (
      <Link
        href={href}
        className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 text-[11px] font-semibold transition-colors ${
          active ? "text-white" : "text-zinc-600 hover:text-zinc-400"
        }`}
      >
        {icon}
        {label}
      </Link>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#242424]" style={{ backgroundColor: "#0A0A0A" }}>
      <div className="max-w-2xl mx-auto flex items-center">
        {tab("/", "Home",
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        )}
        {tab("/venues", "Venues",
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        )}

        {/* Center Log button */}
        <div className="flex-1 flex justify-center">
          <Link
            href="/write-review"
            className="w-12 h-12 rounded-full flex items-center justify-center font-black text-xl shadow-lg transition-opacity hover:opacity-90 -mt-5"
            style={{ backgroundColor: "#FF746C", color: "#000" }}
          >
            +
          </Link>
        </div>

        {tab("/artists", "Artists",
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        )}
        {tab("/profile", "Profile",
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )}
      </div>
    </nav>
  );
}
