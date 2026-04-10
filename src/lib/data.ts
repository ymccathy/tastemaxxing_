export type Rating = "worth-it" | "mid" | "skip";

export type Log = {
  id: string;
  authorName: string;
  authorAvatar: string;
  subject: string;       // "Artist @ Venue" or "Venue Name"
  subjectType: "artist" | "venue";
  rating: Rating;
  tags: string[];
  note?: string;
  date: string;          // ISO string
};

export const TAGS = ["sound", "crowd", "vibe", "intimate", "warehouse", "sweaty", "peaking", "chill", "big room", "fire set"];

export const SEED_LOGS: Log[] = [
  {
    id: "l1",
    authorName: "Maya",
    authorAvatar: "MR",
    subject: "Hunee @ Good Room",
    subjectType: "artist",
    rating: "worth-it",
    tags: ["sound", "intimate", "peaking"],
    note: "6 hour set. didn't leave til 6am. one of the best nights of my life.",
    date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: "l2",
    authorName: "Carlos",
    authorAvatar: "CM",
    subject: "Peggy Gou @ Avant Gardner",
    subjectType: "artist",
    rating: "mid",
    tags: ["crowd", "big room"],
    note: "sound was great but crowd was giving concert not rave",
    date: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
  },
  {
    id: "l3",
    authorName: "Jordan",
    authorAvatar: "JT",
    subject: "More Eaze @ Elsewhere",
    subjectType: "artist",
    rating: "worth-it",
    tags: ["vibe", "intimate"],
    note: "had never heard of them. buy the ticket immediately if you see them on a lineup",
    date: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
  {
    id: "l4",
    authorName: "Sam",
    authorAvatar: "SL",
    subject: "Nowadays",
    subjectType: "venue",
    rating: "worth-it",
    tags: ["crowd", "vibe"],
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: "l5",
    authorName: "Priya",
    authorAvatar: "PK",
    subject: "Chris Lorenzo @ Stage B",
    subjectType: "artist",
    rating: "worth-it",
    tags: ["sound", "warehouse", "sweaty"],
    note: "teksupport never misses. got there at 1am left at 7",
    date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
  {
    id: "l6",
    authorName: "Alex",
    authorAvatar: "AW",
    subject: "CamelPhat @ Brooklyn Storehouse",
    subjectType: "artist",
    rating: "mid",
    tags: ["sound", "crowd"],
    note: "production was massive but felt like a concert. expected more of a rave",
    date: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
  },
];

export type Venue = {
  slug: string;
  name: string;
  neighborhood: string;
  address: string;
  subway: string;
  subwayWalkMin: number;
  capacity: "intimate" | "medium" | "large" | "massive";
  capacityNum: number;
  indoorOutdoor: "indoor" | "outdoor" | "both";
  cashOnly: boolean;
  coatCheck: string;
  avgDrinkPrice: string;
  typicalDoorsDelay: string; // how late sets actually start vs doors
  bathroomRating: number;
  crowdTags: string[];
  dresscode: string;
  description: string;
  image: string;
  overallRating: number;
  reviewCount: number;
  stages: string[];
};

export type Artist = {
  slug: string;
  name: string;
  genres: string[];
  hometown: string;
  spotifyFollowers: string;
  liveRating: number;
  liveRatingCount: number;
  description: string;
  image: string;
  tags: string[];
};

export type Event = {
  slug: string;
  name: string;
  venueSlug: string;
  date: string;
  time: string;
  lineup: string[]; // artist slugs
  ticketPrice: string;
  ticketUrl: string;
  genres: string[];
  image: string;
  worthItScore: number;
  worthItVotes: number;
  avgSpend: string;
};

export type Review = {
  id: string;
  type: "event" | "venue" | "artist";
  targetSlug: string;
  targetName: string;
  venueSlug?: string;
  venueName?: string;
  eventSlug?: string;
  eventName?: string;
  authorName: string;
  authorAvatar: string;
  date: string;
  // Sub-ratings 1–5 each; overallRating = avg of whichever are provided
  djRating?: number;
  crowdRating?: number;
  venueRating?: number;
  overallRating: number;
  worthIt: boolean | null;
  text: string;
  tags: string[];
  spend?: string;
  media?: { type: "image" | "video"; url: string }[];
};

export function computeOverall(dj?: number, crowd?: number, venue?: number): number {
  const vals = [dj, crowd, venue].filter((v): v is number => v !== undefined);
  if (vals.length === 0) return 0;
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
}

export const venues: Venue[] = [
  {
    slug: "elsewhere",
    name: "Elsewhere",
    neighborhood: "Bushwick, Brooklyn",
    address: "599 Johnson Ave, Brooklyn, NY 11237",
    subway: "L train → Morgan Ave",
    subwayWalkMin: 7,
    capacity: "large",
    capacityNum: 1500,
    indoorOutdoor: "both",
    cashOnly: false,
    coatCheck: "$5",
    avgDrinkPrice: "$14–18",
    typicalDoorsDelay: "Sets start ~1.5hrs after doors",
    bathroomRating: 3.8,
    crowdTags: ["heads-only", "very welcoming", "diverse", "rave-ready"],
    dresscode: "Come as you are",
    description: "Three-floor venue in Bushwick with Hall, Zone One, and the Rooftop. One of NYC's best sound systems. Hall is the main room, Zone One is the intimate basement.",
    image: "/venues/elsewhere.jpg",
    overallRating: 4.5,
    reviewCount: 142,
    stages: ["Hall", "Zone One", "Rooftop"],
  },
  {
    slug: "avant-gardner",
    name: "Avant Gardner",
    neighborhood: "East Williamsburg, Brooklyn",
    address: "140 Stewart Ave, Brooklyn, NY 11237",
    subway: "L train → Morgan Ave",
    subwayWalkMin: 12,
    capacity: "massive",
    capacityNum: 5000,
    indoorOutdoor: "both",
    cashOnly: false,
    coatCheck: "$5",
    avgDrinkPrice: "$16–20",
    typicalDoorsDelay: "Sets start ~2hrs after doors",
    bathroomRating: 2.9,
    crowdTags: ["mixed", "tourist-friendly", "dress-up crowd", "bridge and tunnel"],
    dresscode: "Smart casual to dressed up",
    description: "Massive multi-room complex with Great Hall, Brooklyn Mirage (outdoor), and Lost in Dreams. Best for big name headliners. Brooklyn Mirage in summer is iconic.",
    image: "/venues/avant-gardner.jpg",
    overallRating: 3.9,
    reviewCount: 287,
    stages: ["Great Hall", "Brooklyn Mirage", "Lost in Dreams", "The Kings Hall"],
  },
  {
    slug: "good-room",
    name: "Good Room",
    neighborhood: "Greenpoint, Brooklyn",
    address: "98 Meserole Ave, Brooklyn, NY 11222",
    subway: "G train → Nassau Ave",
    subwayWalkMin: 10,
    capacity: "intimate",
    capacityNum: 350,
    indoorOutdoor: "indoor",
    cashOnly: false,
    coatCheck: "Free",
    avgDrinkPrice: "$12–16",
    typicalDoorsDelay: "Sets start ~1hr after doors",
    bathroomRating: 3.2,
    crowdTags: ["heads-only", "locals", "deep listeners", "no phones vibe"],
    dresscode: "Come as you are",
    description: "Intimate 350-cap room in Greenpoint with an exceptional sound system. Best for deep house, disco, and leftfield. The crowd is serious about music. Don't come here to party — come to listen.",
    image: "/venues/good-room.jpg",
    overallRating: 4.7,
    reviewCount: 98,
    stages: ["Main Room", "Bar Room"],
  },
  {
    slug: "schimanski",
    name: "Schimanski",
    neighborhood: "Williamsburg, Brooklyn",
    address: "54 N 11th St, Brooklyn, NY 11249",
    subway: "L train → Bedford Ave",
    subwayWalkMin: 8,
    capacity: "medium",
    capacityNum: 800,
    indoorOutdoor: "indoor",
    cashOnly: false,
    coatCheck: "$5",
    avgDrinkPrice: "$14–18",
    typicalDoorsDelay: "Sets start ~1hr after doors",
    bathroomRating: 3.5,
    crowdTags: ["mixed", "tech house crowd", "instagram-friendly", "moderate tourists"],
    dresscode: "Smart casual",
    description: "Mid-size club in Williamsburg known for tech house and techno. Good production, reliable sound. More mainstream than Good Room but less tourist-heavy than Avant Gardner.",
    image: "/venues/schimanski.jpg",
    overallRating: 4.1,
    reviewCount: 175,
    stages: ["Main Floor"],
  },
  {
    slug: "nowadays",
    name: "Nowadays",
    neighborhood: "Ridgewood, Queens",
    address: "56-06 Cooper Ave, Queens, NY 11385",
    subway: "M train → Fresh Pond Rd",
    subwayWalkMin: 5,
    capacity: "medium",
    capacityNum: 600,
    indoorOutdoor: "both",
    cashOnly: false,
    coatCheck: "$5 (seasonal)",
    avgDrinkPrice: "$12–16",
    typicalDoorsDelay: "Outdoor sets start at listed time, indoor ~30min late",
    bathroomRating: 3.0,
    crowdTags: ["queer-friendly", "very welcoming", "creative crowd", "locals", "no attitude"],
    dresscode: "Anything goes",
    description: "Beloved outdoor/indoor venue in Ridgewood with a big backyard. Known for eclectic bookings — disco, house, experimental. The outdoor space in summer is one of NYC's best. Very inclusive crowd.",
    image: "/venues/nowadays.jpg",
    overallRating: 4.6,
    reviewCount: 203,
    stages: ["Backyard Stage", "Indoor Room"],
  },
  {
    slug: "brooklyn-storehouse",
    name: "Brooklyn Storehouse",
    neighborhood: "Clinton Hill, Brooklyn",
    address: "Building 293, Assembly Rd, Brooklyn, NY 11205",
    subway: "G train → Classon Ave or C train → Clinton-Washington",
    subwayWalkMin: 10,
    capacity: "large",
    capacityNum: 2000,
    indoorOutdoor: "indoor",
    cashOnly: false,
    coatCheck: "TBD",
    avgDrinkPrice: "$14–18",
    typicalDoorsDelay: "Sets start ~1.5hrs after doors",
    bathroomRating: 3.0,
    crowdTags: ["mixed", "festival-crowd", "big-room energy"],
    dresscode: "Come as you are",
    description: "Large warehouse venue in the Brooklyn Navy Yard area, part of the Assembly complex. Hosts big-name electronic acts. Industrial feel, solid production.",
    image: "/venues/brooklyn-storehouse.jpg",
    overallRating: 3.8,
    reviewCount: 12,
    stages: ["Main Floor"],
  },
  {
    slug: "marquee",
    name: "Marquee",
    neighborhood: "Chelsea, Manhattan",
    address: "289 10th Ave, New York, NY 10001",
    subway: "C/E train → 23rd St",
    subwayWalkMin: 8,
    capacity: "large",
    capacityNum: 1200,
    indoorOutdoor: "indoor",
    cashOnly: false,
    coatCheck: "$5",
    avgDrinkPrice: "$18–24",
    typicalDoorsDelay: "Sets start ~1hr after doors (11pm doors → midnight headliner)",
    bathroomRating: 3.5,
    crowdTags: ["bottle-service crowd", "dressed-up", "manhattan-crowd", "tourist-friendly"],
    dresscode: "Smart/dressy — no sneakers enforced at door",
    description: "Classic Manhattan megaclub in Chelsea. High production, big names, expensive drinks. The crowd skews more nightlife than rave. Good for big EDM acts but don't expect a heads-only room.",
    image: "/venues/marquee.jpg",
    overallRating: 3.5,
    reviewCount: 201,
    stages: ["Main Room", "Mezzanine"],
  },
  {
    slug: "stage-b",
    name: "Stage B (Teksupport)",
    neighborhood: "Sunset Park, Brooklyn",
    address: "4508 2nd Ave, Brooklyn, NY 11232",
    subway: "R train → 45th St",
    subwayWalkMin: 8,
    capacity: "large",
    capacityNum: 1500,
    indoorOutdoor: "indoor",
    cashOnly: false,
    coatCheck: "$5",
    avgDrinkPrice: "$14–18",
    typicalDoorsDelay: "Sets start 1–2hrs after doors. Teksupport events go late — budget for 6am",
    bathroomRating: 2.8,
    crowdTags: ["heads-only", "serious ravers", "late-night", "no-phones vibe"],
    dresscode: "Anything goes — raver-friendly",
    description: "Teksupport's go-to Brooklyn warehouse. Raw industrial space with a punishing sound system. Bookings are consistently serious — underground house, techno, breaks. The crowd knows the music. Goes very late.",
    image: "/venues/stage-b.jpg",
    overallRating: 4.4,
    reviewCount: 67,
    stages: ["Main Floor", "Side Room"],
  },
];

export const artists: Artist[] = [
  {
    slug: "palms-trax",
    name: "Palms Trax",
    genres: ["Deep House", "Disco", "Balearic"],
    hometown: "Berlin, Germany",
    spotifyFollowers: "42K",
    liveRating: 4.8,
    liveRatingCount: 34,
    description: "One of the most underrated live acts in the game. Vinyl-only DJ whose sets blend deep house, cosmic disco, and balearic. Never the same set twice. Small venues only — don't miss him.",
    image: "/artists/palms-trax.jpg",
    tags: ["vinyl-only", "small-rooms", "hidden-gem", "deep-listener"],
  },
  {
    slug: "peggy-gou",
    name: "Peggy Gou",
    genres: ["Tech House", "House", "Disco"],
    hometown: "Seoul / Berlin",
    spotifyFollowers: "1.2M",
    liveRating: 3.4,
    liveRatingCount: 89,
    description: "Huge name, polarizing live sets. Energy is unmatched but the music can veer commercial. Best in big rooms when the crowd is right. Check recent reviews before buying.",
    image: "/artists/peggy-gou.jpg",
    tags: ["high-energy", "big-rooms", "commercial-leaning", "crowd-pleaser"],
  },
  {
    slug: "dj-seinfeld",
    name: "DJ Seinfeld",
    genres: ["Lo-fi House", "Deep House", "Tech House"],
    hometown: "Malmö, Sweden",
    spotifyFollowers: "380K",
    liveRating: 4.6,
    liveRatingCount: 52,
    description: "Consistently excellent live. Started as an anonymous lo-fi house producer, evolved into one of the best selectors around. Great energy reader — knows exactly when to go hard and when to let it breathe.",
    image: "/artists/dj-seinfeld.jpg",
    tags: ["versatile", "crowd-reader", "intimate-to-large", "consistent"],
  },
  {
    slug: "more-eaze",
    name: "More Eaze",
    genres: ["Ambient", "Club", "Experimental"],
    hometown: "Austin, TX",
    spotifyFollowers: "28K",
    liveRating: 4.9,
    liveRatingCount: 18,
    description: "True hidden gem. Live sets are completely unique — blends ambient, club music, and experimental electronics. If you see them on a lineup you don't recognize, go. 28K Spotify followers but one of the best live acts you'll ever see.",
    image: "/artists/more-eaze.jpg",
    tags: ["hidden-gem", "experimental", "must-see", "intimate"],
  },
  {
    slug: "blawan",
    name: "Blawan",
    genres: ["Techno", "Industrial", "Breaks"],
    hometown: "London, UK",
    spotifyFollowers: "95K",
    liveRating: 4.7,
    liveRatingCount: 41,
    description: "Hard techno/industrial with live hardware. Sets are intense and relentless. Not for the faint of heart. The sound system matters a lot — check the venue before going.",
    image: "/artists/blawan.jpg",
    tags: ["intense", "hardware-live", "techno", "earplugs-required"],
  },
  {
    slug: "hunee",
    name: "Hunee",
    genres: ["Deep House", "Disco", "Funk"],
    hometown: "Seoul / Berlin",
    spotifyFollowers: "67K",
    liveRating: 4.9,
    liveRatingCount: 63,
    description: "Legendary for marathon sets. Hunee's selections span deep house, obscure disco, and African funk. A Hunee set feels like a journey — show up early and stay till the end. Best long-set DJ alive.",
    image: "/artists/hunee.jpg",
    tags: ["marathon-sets", "crate-digger", "deep-house", "arrive-early"],
  },
  {
    slug: "camelphat",
    name: "CamelPhat",
    genres: ["House", "Melodic House", "Tech House"],
    hometown: "Liverpool, UK",
    spotifyFollowers: "2.1M",
    liveRating: 4.1,
    liveRatingCount: 0,
    description: "Liverpool duo known for melancholic, melodic house and tech house. Big Spotify presence. Live sets are polished and crowd-pleasing — expect peak-time anthems and smooth builds. Better than average for their mainstream profile.",
    image: "/artists/camelphat.jpg",
    tags: ["melodic-house", "polished", "crowd-pleaser", "big-room"],
  },
  {
    slug: "kshmr",
    name: "KSHMR",
    genres: ["Big Room EDM", "Progressive House"],
    hometown: "San Francisco, CA",
    spotifyFollowers: "8.4M",
    liveRating: 3.2,
    liveRatingCount: 0,
    description: "High-energy big room EDM producer/DJ. Massive Spotify following. Shows are spectacular production-wise. Crowd skews younger and more casual — expect confetti cannons over selector vibes.",
    image: "/artists/kshmr.jpg",
    tags: ["big-room", "high-production", "festival-style", "edm"],
  },
  {
    slug: "chris-lorenzo",
    name: "Chris Lorenzo",
    genres: ["Tech House", "UK House", "Bass House"],
    hometown: "Birmingham, UK",
    spotifyFollowers: "520K",
    liveRating: 4.3,
    liveRatingCount: 0,
    description: "UK tech house selector with a distinctly grimy, bass-heavy sound. Teksupport booking is a great fit — he plays well in warehouse settings. Expect driving, functional sets built for late-night floors.",
    image: "/artists/chris-lorenzo.jpg",
    tags: ["tech-house", "bass-heavy", "warehouse", "uk-sound"],
  },
  {
    slug: "kimonos",
    name: "Kimonos",
    genres: ["House", "Tech House"],
    hometown: "New York, NY",
    spotifyFollowers: "18K",
    liveRating: 0,
    liveRatingCount: 0,
    description: "NYC local opening for CamelPhat at Brooklyn Storehouse. Low follower count but local scene support. No live reviews yet — be the first.",
    image: "/artists/kimonos.jpg",
    tags: ["local-nyc", "opening-act"],
  },
  {
    slug: "airrica",
    name: "Airrica",
    genres: ["House", "Electronic"],
    hometown: "New York, NY",
    spotifyFollowers: "9K",
    liveRating: 0,
    liveRatingCount: 0,
    description: "NYC local on the CamelPhat bill. Very low follower count — could be a hidden gem, could be unknown. No reviews yet.",
    image: "/artists/airrica.jpg",
    tags: ["local-nyc", "opening-act", "unknown"],
  },
];

export const events: Event[] = [
  {
    slug: "elsewhere-dj-seinfeld-apr-19",
    name: "DJ Seinfeld",
    venueSlug: "elsewhere",
    date: "2026-04-19",
    time: "10pm",
    lineup: ["dj-seinfeld"],
    ticketPrice: "$25–35",
    ticketUrl: "https://dice.fm",
    genres: ["Lo-fi House", "Deep House"],
    image: "/events/seinfeld-elsewhere.jpg",
    worthItScore: 89,
    worthItVotes: 0,
    avgSpend: "",
  },
  {
    slug: "good-room-hunee-apr-25",
    name: "Hunee (6hr Set)",
    venueSlug: "good-room",
    date: "2026-04-25",
    time: "11pm",
    lineup: ["hunee"],
    ticketPrice: "$20–30",
    ticketUrl: "https://dice.fm",
    genres: ["Deep House", "Disco", "Funk"],
    image: "/events/hunee-goodroom.jpg",
    worthItScore: 96,
    worthItVotes: 0,
    avgSpend: "",
  },
  {
    slug: "nowadays-palms-trax-may-3",
    name: "Palms Trax",
    venueSlug: "nowadays",
    date: "2026-05-03",
    time: "9pm",
    lineup: ["palms-trax"],
    ticketPrice: "$15–20",
    ticketUrl: "https://dice.fm",
    genres: ["Deep House", "Balearic"],
    image: "/events/palms-trax-nowadays.jpg",
    worthItScore: 94,
    worthItVotes: 0,
    avgSpend: "",
  },
  {
    slug: "avant-gardner-peggy-gou-may-10",
    name: "Peggy Gou",
    venueSlug: "avant-gardner",
    date: "2026-05-10",
    time: "10pm",
    lineup: ["peggy-gou"],
    ticketPrice: "$45–80",
    ticketUrl: "https://dice.fm",
    genres: ["Tech House", "Disco"],
    image: "/events/peggy-avant.jpg",
    worthItScore: 61,
    worthItVotes: 0,
    avgSpend: "",
  },
  {
    slug: "schimanski-blawan-may-16",
    name: "Blawan",
    venueSlug: "schimanski",
    date: "2026-05-16",
    time: "11pm",
    lineup: ["blawan"],
    ticketPrice: "$20–30",
    ticketUrl: "https://dice.fm",
    genres: ["Techno", "Industrial"],
    image: "/events/blawan-schimanski.jpg",
    worthItScore: 85,
    worthItVotes: 0,
    avgSpend: "",
  },
  {
    slug: "camelphat-brooklyn-storehouse-apr-10",
    name: "CamelPhat",
    venueSlug: "brooklyn-storehouse",
    date: "2026-04-10",
    time: "10pm",
    lineup: ["camelphat", "kimonos", "airrica"],
    ticketPrice: "$77–155",
    ticketUrl: "https://www.crowdvolt.com/event/camelphat-brooklyn-storehouse-new-york-new-york-april-10-2026",
    genres: ["House", "Melodic House", "Tech House"],
    image: "/events/camelphat-storehouse.jpg",
    worthItScore: 0,
    worthItVotes: 0,
    avgSpend: "",
  },
  {
    slug: "kshmr-marquee-apr-10",
    name: "KSHMR",
    venueSlug: "marquee",
    date: "2026-04-10",
    time: "11pm",
    lineup: ["kshmr"],
    ticketPrice: "$65–82",
    ticketUrl: "https://www.crowdvolt.com/event/kshmr-marquee-fri-apr-10-new-york",
    genres: ["Big Room EDM", "Progressive House"],
    image: "/events/kshmr-marquee.jpg",
    worthItScore: 0,
    worthItVotes: 0,
    avgSpend: "",
  },
  {
    slug: "chris-lorenzo-stage-b-may-2",
    name: "Chris Lorenzo (Teksupport)",
    venueSlug: "stage-b",
    date: "2026-05-02",
    time: "10pm",
    lineup: ["chris-lorenzo"],
    ticketPrice: "$60–155",
    ticketUrl: "https://www.crowdvolt.com/event/chris-lorenzo-teksupport-stage-b-new-york-may-2-2026",
    genres: ["Tech House", "Bass House", "UK House"],
    image: "/events/chris-lorenzo-stageb.jpg",
    worthItScore: 0,
    worthItVotes: 0,
    avgSpend: "",
  },
  // ── Past events ───────────────────────────────────────────────────────────
  {
    slug: "good-room-hunee-feb-15",
    name: "Hunee (5hr Set)",
    venueSlug: "good-room",
    date: "2026-02-15",
    time: "11pm",
    lineup: ["hunee"],
    ticketPrice: "$20–28",
    ticketUrl: "https://dice.fm",
    genres: ["Deep House", "Disco", "Funk"],
    image: "/events/hunee-goodroom.jpg",
    worthItScore: 97,
    worthItVotes: 31,
    avgSpend: "$68",
  },
  {
    slug: "elsewhere-more-eaze-mar-8",
    name: "More Eaze",
    venueSlug: "elsewhere",
    date: "2026-03-08",
    time: "10pm",
    lineup: ["more-eaze"],
    ticketPrice: "$18–22",
    ticketUrl: "https://dice.fm",
    genres: ["Ambient", "Club", "Experimental"],
    image: "/events/moreeaze-elsewhere.jpg",
    worthItScore: 100,
    worthItVotes: 14,
    avgSpend: "$55",
  },
  {
    slug: "stage-b-blawan-mar-22",
    name: "Blawan (Teksupport)",
    venueSlug: "stage-b",
    date: "2026-03-22",
    time: "11pm",
    lineup: ["blawan"],
    ticketPrice: "$25–35",
    ticketUrl: "https://dice.fm",
    genres: ["Techno", "Industrial", "Breaks"],
    image: "/events/blawan-stageb.jpg",
    worthItScore: 89,
    worthItVotes: 45,
    avgSpend: "$82",
  },
  {
    slug: "nowadays-dj-seinfeld-jan-25",
    name: "DJ Seinfeld",
    venueSlug: "nowadays",
    date: "2026-01-25",
    time: "9pm",
    lineup: ["dj-seinfeld"],
    ticketPrice: "$20–25",
    ticketUrl: "https://dice.fm",
    genres: ["Lo-fi House", "Deep House"],
    image: "/events/seinfeld-nowadays.jpg",
    worthItScore: 92,
    worthItVotes: 28,
    avgSpend: "$60",
  },
];

export const reviews: Review[] = [
  {
    id: "r1",
    type: "event",
    targetSlug: "good-room-hunee-apr-25",
    targetName: "Hunee @ Good Room",
    venueSlug: "good-room",
    venueName: "Good Room",
    eventSlug: "good-room-hunee-apr-25",
    eventName: "Hunee (6hr Set)",
    authorName: "Maya R.",
    authorAvatar: "MR",
    date: "2026-03-15",
    djRating: 5,
    crowdRating: 5,
    venueRating: 5,
    overallRating: 5,
    worthIt: true,
    text: "Best night of my life, not exaggerating. Hunee played for 6 hours and every single track felt intentional. The room was packed but never uncomfortable. Good Room's sound system is insane at that volume. Got there at 11, didn't leave until 6am. Spent maybe $70 total including ticket + 3 drinks. Absolutely worth every penny.",
    tags: ["arrive-early", "stay-till-close", "vinyl-magic", "crowd-was-incredible"],
    spend: "$70",
    media: [
      { type: "image", url: "https://picsum.photos/seed/goodroom1/600/600" },
      { type: "image", url: "https://picsum.photos/seed/goodroom2/600/600" },
      { type: "image", url: "https://picsum.photos/seed/goodroom3/600/600" },
    ],
  },
  {
    id: "r2",
    type: "event",
    targetSlug: "avant-gardner-peggy-gou-may-10",
    targetName: "Peggy Gou @ Avant Gardner",
    venueSlug: "avant-gardner",
    venueName: "Avant Gardner",
    eventSlug: "avant-gardner-peggy-gou-may-10",
    eventName: "Peggy Gou",
    authorName: "Carlos M.",
    authorAvatar: "CM",
    date: "2026-03-02",
    djRating: 3,
    crowdRating: 2,
    venueRating: 4,
    overallRating: 3,
    worthIt: false,
    text: "Sound was great, Avant Gardner always delivers on production. But the crowd was mostly people who don't go to clubs usually — lots of phones, people talking through the whole set. Peggy's music was fine but felt more like a concert than a rave. $80 ticket plus drinks I spent like $130 on this night. Not worth it for me personally.",
    tags: ["tourist-crowd", "instagram-crowd", "good-sound", "overpriced"],
    spend: "$130",
  },
  {
    id: "r3",
    type: "venue",
    targetSlug: "elsewhere",
    targetName: "Elsewhere",
    venueSlug: "elsewhere",
    venueName: "Elsewhere",
    authorName: "Priya K.",
    authorAvatar: "PK",
    date: "2026-03-28",
    crowdRating: 4,
    venueRating: 5,
    overallRating: 4.5,
    worthIt: true,
    text: "Elsewhere is my home venue. Zone One (basement) has one of the best sound systems in the city — the bass is physical without being painful. Hall upstairs is great for bigger acts. Rooftop is only open in summer but magical. L to Morgan is easy, 7 min walk. Coat check is $5 and line moves fast. Drinks are $16 but you don't need that many — the music keeps you going.",
    tags: ["best-sound-system", "easy-subway", "multiple-rooms", "consistent"],
    spend: "",
    media: [
      { type: "image", url: "https://picsum.photos/seed/elsewherevenue1/600/600" },
      { type: "image", url: "https://picsum.photos/seed/elsewherevenue2/600/600" },
    ],
  },
  {
    id: "r4",
    type: "artist",
    targetSlug: "more-eaze",
    targetName: "More Eaze",
    authorName: "Jordan T.",
    authorAvatar: "JT",
    date: "2026-04-01",
    djRating: 5,
    crowdRating: 5,
    overallRating: 5,
    worthIt: true,
    text: "I had literally never heard of More Eaze before a friend dragged me to this show. 28K spotify followers. I have been listening to their music every single day since. The set was unlike anything — ambient textures into full club music into these weird dissolving passages. If you see this name on a lineup BUY THE TICKET. Hidden gem doesn't even cover it.",
    tags: ["hidden-gem", "genre-defying", "must-see", "buy-the-ticket"],
    spend: "",
  },
  {
    id: "r5",
    type: "event",
    targetSlug: "elsewhere-dj-seinfeld-apr-19",
    targetName: "DJ Seinfeld @ Elsewhere",
    venueSlug: "elsewhere",
    venueName: "Elsewhere",
    eventSlug: "elsewhere-dj-seinfeld-apr-19",
    eventName: "DJ Seinfeld",
    authorName: "Alex W.",
    authorAvatar: "AW",
    date: "2026-02-20",
    djRating: 5,
    crowdRating: 4,
    venueRating: 5,
    overallRating: 4.7,
    worthIt: true,
    text: "Seinfeld in Zone One was exactly what I needed. Intimate room, everyone there for the music. He opened with something really slow and dubby, built it up over 3 hours to this euphoric peak around 3am. Sound in Zone One hits different — felt like the bass was in my chest the whole time. $25 ticket, 2 drinks, $65 total. Would pay double.",
    tags: ["peak-hour-magic", "zone-one", "intimate", "worth-double"],
    spend: "$65",
    media: [
      { type: "image", url: "https://picsum.photos/seed/elsewhere1/600/600" },
      { type: "image", url: "https://picsum.photos/seed/elsewhere2/600/600" },
    ],
  },
  {
    id: "r6",
    type: "venue",
    targetSlug: "nowadays",
    targetName: "Nowadays",
    venueSlug: "nowadays",
    venueName: "Nowadays",
    authorName: "Sam L.",
    authorAvatar: "SL",
    date: "2026-03-10",
    crowdRating: 5,
    venueRating: 4,
    overallRating: 4.5,
    worthIt: true,
    text: "Nowadays has the best crowd in NYC, full stop. No attitude, everyone's just there to have a good time. The backyard in summer is magical. M train to Fresh Pond is underrated easy — 5 min walk. Bathrooms are fine but can get a line late night. Drinks are cheaper than most Brooklyn clubs. The bookings are always interesting — they take chances on weird stuff that always ends up being right.",
    tags: ["best-crowd", "no-attitude", "outdoor-space", "affordable"],
    spend: "",
  },
];

export function getVenue(slug: string) {
  return venues.find((v) => v.slug === slug);
}

export function getArtist(slug: string) {
  return artists.find((a) => a.slug === slug);
}

export function getEvent(slug: string) {
  return events.find((e) => e.slug === slug);
}

export function getReviewsForTarget(slug: string) {
  return reviews.filter((r) => r.targetSlug === slug || r.venueSlug === slug || r.eventSlug === slug);
}

export function getUpcomingEventsForArtist(artistSlug: string) {
  const now = new Date().toISOString().split("T")[0];
  return events.filter((e) => e.lineup.includes(artistSlug) && e.date >= now);
}

export function getUpcomingEventsForVenue(venueSlug: string) {
  const now = new Date().toISOString().split("T")[0];
  return events.filter((e) => e.venueSlug === venueSlug && e.date >= now);
}
