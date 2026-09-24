/**
 * Seed catalogue, shaped exactly like the public_* views.
 *
 * Used when NEXT_PUBLIC_SUPABASE_URL is not set, so the site can be designed
 * and reviewed before the operations database exists. supabase/seed.sql loads
 * the same rows into Postgres. Copy is draft copy in the design-system voice.
 * There are no prices here: the public site never displays one.
 */
import type { GalleryItem, PublicActivity, PublicPackage, PublicResource } from "./database.types";

const g = (path: string, alt: string): GalleryItem => ({ path, alt });

export const ACTIVITY_TYPE_LABEL = {
  underwater: "Underwater",
  air: "In the air",
  boat: "On the boat",
  wildlife: "Wildlife",
} as const;

export const activities: PublicActivity[] = [
  {
    id: "a1000000-0000-4000-8000-000000000001",
    slug: "undersea-walk",
    name: "Undersea walk",
    activity_type: "underwater",
    summary: "Walk the lagoon floor in a helmet fed with air from the surface. No swimming needed.",
    description: `You step down a ladder from our platform and walk along the sandy floor of the lagoon, about three to four metres down, wearing a helmet that is fed fresh air from the surface. Your head stays dry, glasses can stay on, and you breathe normally.

A guide walks with you the whole time. Expect sergeant majors, butterflyfish and the odd curious wrasse coming close enough to feed from your hand.

What to bring:
- Swimwear and a towel
- A change of clothes for the ride back
- Reef-safe sunscreen

The walk itself lasts about 25 minutes. The full activity, including briefing and the boat ride to the platform, takes 45 minutes.`,
    duration_minutes: 45,
    min_age: 7,
    restrictions:
      "Not suitable during pregnancy or with a cold, sinus or ear infection. No swimming ability needed.",
    hero_image: "diver-fish",
    gallery: [
      g("diver-fish", "A diver surrounded by a school of yellow fish"),
      g("reef-colour", "Coral reef with small fish in clear blue water"),
      g("fish-school", "A school of silver fish in open water"),
      g("reef-triggerfish", "A titan triggerfish on the reef floor"),
      g("reef-fish", "Sergeant major fish over coral"),
    ],
    sort_order: 10,
    seo_title: "Undersea walk in Mauritius",
    seo_description:
      "Walk the lagoon floor in a surface-fed helmet. No swimming needed, ages 7 and up, 45 minutes with briefing.",
  },
  {
    id: "a1000000-0000-4000-8000-000000000002",
    slug: "parasailing",
    name: "Parasailing",
    activity_type: "air",
    summary:
      "Ten minutes in the air above the lagoon, launched and landed from the back of the boat.",
    description: `You take off from the deck of our winch boat and rise to around 60 metres above the lagoon. From up there you can see the colour of the reef change from turquoise to deep blue where it drops away.

Fly on your own or in tandem. Landings are back on the deck, so you only get wet if you ask the skipper for a dip on the way down.

What to bring:
- Clothes you do not mind getting splashed
- Sunglasses with a strap
- A camera or phone on a lanyard

Flights run in winds up to 20 knots. If the skipper postpones because of weather, we move you to the next slot or refund you in full.`,
    duration_minutes: 30,
    min_age: 6,
    restrictions:
      "Combined weight limits apply for tandem flights. Children fly in tandem with an adult.",
    hero_image: "parasail-turquoise",
    gallery: [
      g("parasail-turquoise", "A parasail over turquoise water towed by a small boat"),
      g("parasail-yacht", "A parasail flying beside a white motor yacht"),
      g("parasail-boat", "A rainbow parasail above a speedboat"),
      g("parasail-close", "Two people in a tandem parasail harness"),
    ],
    sort_order: 20,
    seo_title: "Parasailing in Mauritius",
    seo_description:
      "Ten minutes in the air above the lagoon, solo or tandem, launched and landed from the boat deck. Ages 6 and up.",
  },
  {
    id: "a1000000-0000-4000-8000-000000000003",
    slug: "snorkelling",
    name: "Snorkelling trip",
    activity_type: "underwater",
    summary:
      "A guided snorkel on the outer lagoon reef, with masks, fins and life jackets provided.",
    description: `We take you by boat to a stretch of reef chosen for the day's conditions and stay with you in the water. Beginners get a quick lesson on the boat first; confident swimmers can explore further with the guide.

Every guest wears a life jacket or buoyancy vest. Masks are washed and disinfected between trips, and we carry prescription masks in a few common strengths.

What to bring:
- Swimwear and a towel
- A rash vest or T-shirt against the sun
- Reef-safe sunscreen, applied an hour before`,
    duration_minutes: 90,
    min_age: 5,
    restrictions: "Children under 12 snorkel with an adult. Life jackets are worn by everyone.",
    hero_image: "snorkel-surface",
    gallery: [
      g("snorkel-surface", "Two snorkellers floating over a shallow reef"),
      g("snorkel-coral", "A snorkeller swimming above a large coral head"),
      g("snorkel-reef", "A snorkeller over table coral"),
      g("coral-garden", "Pink and orange soft corals"),
      g("reef-fish", "Sergeant major fish over coral"),
    ],
    sort_order: 30,
    seo_title: "Guided snorkelling trip in Mauritius",
    seo_description:
      "A guided snorkel on the outer lagoon reef with masks, fins and life jackets provided. 90 minutes, ages 5 and up.",
  },
  {
    id: "a1000000-0000-4000-8000-000000000004",
    slug: "glass-bottom-boat",
    name: "Glass-bottom boat",
    activity_type: "boat",
    summary: "See the coral gardens through the hull without getting wet. Good for every age.",
    description: `An hour over the shallow coral gardens in a boat with a glass viewing floor. The skipper stops over the best patches and names what you are looking at.

This is the trip we suggest for grandparents, very young children and anyone who would rather stay dry. If you change your mind, there is usually a chance to snorkel off the side for ten minutes.`,
    duration_minutes: 60,
    min_age: null,
    restrictions: "Suitable for all ages. Children under 4 travel free on an adult's lap.",
    hero_image: "glass-bottom",
    gallery: [
      g("glass-bottom", "A glass-bottom boat with a thatched roof on bright blue water"),
      g("bluebay-reef", "Clear shallow water over dark reef rocks"),
      g("reef-deep", "A reef seen from above in clear water"),
      g("reef-colour", "Coral reef with small fish"),
    ],
    sort_order: 40,
    seo_title: "Glass-bottom boat trip in Mauritius",
    seo_description:
      "An hour over the coral gardens through a glass hull. Suitable for all ages and for guests who prefer to stay dry.",
  },
  {
    id: "a1000000-0000-4000-8000-000000000005",
    slug: "dolphin-watching",
    name: "Dolphin watching",
    activity_type: "wildlife",
    summary:
      "An early start along the west coast to find spinner and bottlenose dolphins in the bay.",
    description: `We leave at 07:00, when the dolphins are resting in the calm water of the west-coast bays. The skipper keeps to the national code of conduct: we approach slowly from the side, never chase, and leave when the pod moves on.

Swimming with the dolphins is at the skipper's discretion on the day. When the pod is resting or there are too many boats, we watch from the deck instead.

What to bring:
- A light jacket for the early start
- Swimwear under your clothes
- Breakfast is not included, so eat before you come`,
    duration_minutes: 150,
    min_age: 4,
    restrictions:
      "Departs 07:00. Sightings are very likely but never guaranteed. In-water time depends on conditions.",
    hero_image: "dolphins-coast",
    gallery: [
      g("dolphins-coast", "Spinner dolphins surfacing close to a green coastline"),
      g("dolphins-pod", "A pod of spinner dolphins swimming under the surface"),
      g("dolphins-aerial", "A pod of dolphins seen from above in blue water"),
      g("le-morne-lagoon", "Aerial view of Le Morne and the southwest lagoon"),
    ],
    sort_order: 50,
    seo_title: "Dolphin watching in Mauritius",
    seo_description:
      "An early-morning trip to find spinner and bottlenose dolphins, run to the national code of conduct. Departs 07:00.",
  },
  {
    id: "a1000000-0000-4000-8000-000000000006",
    slug: "speed-boat-island-run",
    name: "Speed boat island run",
    activity_type: "boat",
    summary:
      "A fast crossing to a small lagoon island, with time ashore to swim and walk the beach.",
    description: `A quick, dry ride across the lagoon to one of the small islands off the coast, with an hour ashore to swim, walk the sandbank and find some shade under the filao trees.

The skipper picks the island on the day depending on wind and tide. On the way back we slow down over the reef so you can see the colour change.`,
    duration_minutes: 120,
    min_age: 3,
    restrictions:
      "Not recommended with back problems or during pregnancy — the crossing can be bumpy.",
    hero_image: "cerfs-speedboat",
    gallery: [
      g("cerfs-speedboat", "A yellow speedboat moored in clear water beneath trees"),
      g("benitiers-speedboat", "A speedboat at anchor in calm lagoon water"),
      g("cerfs-lagoon", "Turquoise shallows off a sandy island beach"),
      g("cerfs-shore", "Black rocks and a speedboat in bright turquoise water"),
    ],
    sort_order: 60,
    seo_title: "Speed boat island trip in Mauritius",
    seo_description:
      "A fast crossing to a small lagoon island with an hour ashore to swim and walk the sandbank. Two hours in total.",
  },
  {
    id: "a1000000-0000-4000-8000-000000000007",
    slug: "sunset-cruise",
    name: "Sunset cruise",
    activity_type: "boat",
    summary:
      "Two slow hours on the catamaran as the sun goes down, with drinks and canapés on board.",
    description: `We leave about two hours before sunset and sail along the coast while the light goes gold, then turn for home as the sun drops behind the horizon.

Soft drinks, local rum punch and a few canapés are served on board. Music is kept low; this is a trip for talking.`,
    duration_minutes: 120,
    min_age: null,
    restrictions: "Alcohol is served to guests aged 18 and over only.",
    hero_image: "biches-sunset",
    gallery: [
      g("biches-sunset", "Small boats silhouetted against an orange sunset"),
      g("biches-sunset-2", "Moored boats and a low sun over the bay"),
      g("bluebay-dawn", "Yachts at anchor reflected in still water at dusk"),
      g("catamaran-hk40", "A white sailing catamaran under sail"),
    ],
    sort_order: 70,
    seo_title: "Sunset catamaran cruise in Mauritius",
    seo_description:
      "Two slow hours on the catamaran at sunset, with soft drinks, rum punch and canapés on board.",
  },
  {
    id: "a1000000-0000-4000-8000-000000000008",
    slug: "turtle-snorkel",
    name: "Turtle snorkel",
    activity_type: "wildlife",
    summary:
      "Snorkel the seagrass beds where green turtles come to feed, with a guide in the water.",
    description: `Green turtles graze on the seagrass beds just inside the reef. We anchor well away from them and swim over quietly with a guide, keeping at least two metres away and never touching.

Turtles are wild animals and sightings are likely but not guaranteed. On a quiet day, we move to a second site before heading back.`,
    duration_minutes: 120,
    min_age: 8,
    restrictions: "Confident swimmers only. Life jackets are provided and recommended.",
    hero_image: "turtle-surface",
    gallery: [
      g("turtle-surface", "A green turtle swimming just below the surface"),
      g("turtle-reef", "A green turtle gliding over coral"),
      g("turtle-blue", "A sea turtle in open blue water"),
      g("snorkel-surface", "Snorkellers floating over the reef"),
    ],
    sort_order: 80,
    seo_title: "Snorkel with turtles in Mauritius",
    seo_description:
      "A guided snorkel over the seagrass beds where green turtles feed. Two hours, confident swimmers aged 8 and up.",
  },
];

const inc = (slug: string) => {
  const a = activities.find((x) => x.slug === slug)!;
  return { id: a.id, slug: a.slug, name: a.name, duration_minutes: a.duration_minutes };
};

export const packages: PublicPackage[] = [
  {
    id: "b2000000-0000-4000-8000-000000000001",
    slug: "full-day-catamaran",
    name: "Full day catamaran",
    summary:
      "Catamaran, island visit, barbecue lunch and snorkelling. Departs 09:00, returns 15:30.",
    description: `The day most of our guests remember. We sail out across the lagoon in the morning, stop to snorkel on the reef, then anchor off the island for a long lunch.

The day:
- 09:00 — Welcome on board, safety briefing and coffee
- 10:00 — Snorkelling stop on the outer reef
- 12:00 — Barbecue lunch on board: grilled fish, chicken, salads and fruit
- 13:00 — Free time ashore on the island
- 14:45 — Sail home with rum punch and fresh fruit
- 15:30 — Back at the jetty

Vegetarian and children's plates are available if you tell us when you enquire.`,
    departs: "09:00",
    returns: "15:30",
    hero_image: "cerfs-aerial",
    gallery: [
      g("cerfs-aerial", "Aerial view of an island ringed by white sand and turquoise lagoon"),
      g("catamaran-hk40", "A white sailing catamaran under sail"),
      g("cerfs-lagoon", "Turquoise water off an island beach"),
      g("cerfs-beach", "A long white beach backed by filao trees"),
      g("snorkel-surface", "Snorkellers floating over the reef"),
      g("cerfs-aerial-2", "An island and its lagoon seen from the air"),
    ],
    included_activities: [inc("snorkelling"), inc("speed-boat-island-run")],
    sort_order: 10,
    seo_title: "Full day catamaran cruise with lunch — Mauritius",
    seo_description:
      "Catamaran, island visit, barbecue lunch and snorkelling. Departs 09:00, returns 15:30.",
  },
  {
    id: "b2000000-0000-4000-8000-000000000002",
    slug: "dolphins-and-crystal-rock",
    name: "Dolphins and Crystal Rock",
    summary:
      "Dolphins at dawn, a swim at Crystal Rock and lunch on Île aux Bénitiers. Back by 13:30.",
    description: `An early morning on the southwest coast, under the shadow of Le Morne. We look for dolphins first, while the sea is calm, then run down the lagoon to Crystal Rock, the coral outcrop that stands on its own in the shallows.

The morning ends with a grilled lunch on Île aux Bénitiers before we bring you back to the jetty.`,
    departs: "07:00",
    returns: "13:30",
    hero_image: "crystal-rock",
    gallery: [
      g("crystal-rock", "Crystal Rock, a coral outcrop in the lagoon with Le Morne behind"),
      g("benitiers-le-morne", "Turquoise lagoon with Le Morne mountain in the distance"),
      g("dolphins-pod", "A pod of spinner dolphins under the surface"),
      g("benitiers-beach", "A beach on Île aux Bénitiers with driftwood and Le Morne behind"),
      g("le-morne-lagoon", "Aerial view of Le Morne and the lagoon"),
    ],
    included_activities: [
      inc("dolphin-watching"),
      inc("snorkelling"),
      inc("speed-boat-island-run"),
    ],
    sort_order: 20,
    seo_title: "Dolphins, Crystal Rock and Île aux Bénitiers — Mauritius",
    seo_description:
      "Dolphin watching at dawn, a swim at Crystal Rock and lunch on Île aux Bénitiers. Departs 07:00, back by 13:30.",
  },
  {
    id: "b2000000-0000-4000-8000-000000000003",
    slug: "blue-bay-marine-park",
    name: "Blue Bay marine park",
    summary: "The protected reef three ways: through the glass, on the surface and on the seabed.",
    description: `Blue Bay is one of the island's protected marine parks, and the water is as clear as its name. This half day shows it from three angles.

We start dry on the glass-bottom boat, get in with masks and fins at the reef edge, then finish with an undersea walk on the sand. A good choice for families with mixed ages and mixed confidence in the water.`,
    departs: "09:30",
    returns: "13:00",
    hero_image: "bluebay-lagoon",
    gallery: [
      g("bluebay-lagoon", "The turquoise lagoon of Blue Bay with a wooded island"),
      g("bluebay-reef", "Clear shallow water over dark reef rocks"),
      g("bluebay-beach", "A curving white beach at Blue Bay"),
      g("reef-colour", "Coral reef with small fish"),
    ],
    included_activities: [inc("glass-bottom-boat"), inc("snorkelling"), inc("undersea-walk")],
    sort_order: 30,
    seo_title: "Blue Bay marine park half day — Mauritius",
    seo_description:
      "Glass-bottom boat, snorkelling and an undersea walk in the Blue Bay marine park. 09:30 to 13:00.",
  },
  {
    id: "b2000000-0000-4000-8000-000000000004",
    slug: "lagoon-to-sunset",
    name: "Lagoon to sunset",
    summary: "An afternoon of parasailing followed by the sunset cruise. Departs 14:00.",
    description: `Fly over the lagoon in the afternoon light, then move across to the catamaran for two slow hours as the sun goes down.

Parasailing flights are scheduled first so that any weather delay only moves your flight, not your sunset.`,
    departs: "14:00",
    returns: "18:30",
    hero_image: "biches-aerial",
    gallery: [
      g("biches-aerial", "Aerial view of a long turquoise beach and lagoon"),
      g("parasail-turquoise", "A parasail over turquoise water"),
      g("biches-sunset", "Small boats silhouetted against an orange sunset"),
    ],
    included_activities: [inc("parasailing"), inc("sunset-cruise")],
    sort_order: 40,
    seo_title: "Parasailing and sunset cruise — Mauritius",
    seo_description:
      "An afternoon of parasailing over the lagoon, then the sunset cruise on the catamaran. 14:00 to 18:30.",
  },
];

const act = (...slugs: string[]) => slugs.map((s) => activities.find((a) => a.slug === s)!.id);

const standardIncludes = [
  "Skipper and crew",
  "Fuel",
  "Snorkelling equipment",
  "Water and soft drinks",
];

export const resources: PublicResource[] = [
  {
    id: "c3000000-0000-4000-8000-000000000001",
    slug: "catamaran-1",
    name: "Catamaran 1",
    summary: "14 m sailing catamaran. Up to 30 guests, trampolines forward, shaded aft deck.",
    description: `Our first sailing catamaran and still the one guests ask for by name. Two wide trampolines at the bow for lying in the sun, a shaded aft deck for lunch, and enough stability that nobody spills their drink.

She runs the full day catamaran and the sunset cruise, and is available for private charter.`,
    capacity: 30,
    length_m: 14,
    specs: {
      Length: "14 m",
      Capacity: "30 guests",
      Crew: "3",
      "Cruising speed": "7 knots",
      Shade: "Full bimini aft",
      Facilities: "Marine toilet, freshwater rinse",
    },
    hero_image: "catamaran-hk40",
    gallery: [
      g("catamaran-hk40", "A white sailing catamaran under sail"),
      g("catamaran-sail-red", "A sailing catamaran heeling in a breeze"),
      g("cerfs-aerial", "An island and its lagoon from the air"),
      g("boat-sandbank", "A boat anchored off a white sandbank"),
      g("cerfs-lagoon", "Turquoise water off an island beach"),
      g("biches-sunset", "Boats at sunset"),
    ],
    charter_terms: {
      basis: "Half day, up to 30 guests",
      includes: standardIncludes,
      excludes: ["Lunch — available on request", "VAT"],
    },
    serves_activity_ids: act("snorkelling", "sunset-cruise"),
    sort_order: 10,
    seo_title: "Catamaran 1 — private catamaran charter in Mauritius",
    seo_description: "14 m sailing catamaran for up to 30 guests. Available for private charter.",
  },
  {
    id: "c3000000-0000-4000-8000-000000000002",
    slug: "catamaran-2",
    name: "Catamaran 2",
    summary: "15 m sailing catamaran. Up to 40 guests, barbecue on board, swim ladder aft.",
    description: `The larger of our two sailing catamarans, fitted with a gas barbecue so lunch is cooked on board while you swim. The saloon is open on three sides, which keeps it cool on the hottest days.

She is the boat we use for group bookings, weddings and hotel partner days.`,
    capacity: 40,
    length_m: 15,
    specs: {
      Length: "15 m",
      Capacity: "40 guests",
      Crew: "4",
      "Cruising speed": "7 knots",
      Galley: "Gas barbecue",
      Facilities: "Two marine toilets, freshwater shower",
    },
    hero_image: "catamaran-mauritius",
    gallery: [
      g(
        "catamaran-mauritius",
        "A white catamaran moored in a Mauritian marina with mountains behind",
      ),
      g("catamaran-hk40", "A sailing catamaran at sea"),
      g("cerfs-beach", "A long white beach backed by trees"),
      g("grandbaie-boats", "Boats at anchor in a turquoise bay"),
      g("bluebay-dawn", "Yachts at anchor at dusk"),
    ],
    charter_terms: {
      basis: "Half day, up to 40 guests",
      includes: standardIncludes,
      excludes: ["Barbecue lunch — on request", "VAT"],
    },
    serves_activity_ids: act("snorkelling", "speed-boat-island-run"),
    sort_order: 20,
    seo_title: "Catamaran 2 — group catamaran charter in Mauritius",
    seo_description:
      "15 m sailing catamaran for up to 40 guests with a barbecue on board. Available for private charter.",
  },
  {
    id: "c3000000-0000-4000-8000-000000000003",
    slug: "cataspeed",
    name: "Cataspeed",
    summary: "18 m power catamaran. Up to 40 guests, shaded deck, freshwater shower.",
    description: `When you want to cover more of the coast in a day, Cataspeed is the boat. Twin engines let her reach the southwest and back comfortably, and the deck is shaded end to end.

We use her for the dolphin and Crystal Rock trips and for private charters that want to see more than one side of the island.`,
    capacity: 40,
    length_m: 18,
    specs: {
      Length: "18 m",
      Capacity: "40 guests",
      Crew: "4",
      "Cruising speed": "18 knots",
      Engines: "Twin inboard diesel",
      Facilities: "Freshwater shower, two toilets",
    },
    hero_image: "speed-yacht",
    gallery: [
      g("speed-yacht", "A white motor boat running at speed on deep blue water"),
      g("crystal-rock", "Crystal Rock in the lagoon"),
      g("dolphins-coast", "Dolphins near the coast"),
      g("boats-aerial", "Boats on turquoise water seen from above"),
      g("underwater-waterfall", "The southwest tip of the island from the air"),
    ],
    charter_terms: {
      basis: "Half day, up to 40 guests",
      includes: standardIncludes,
      excludes: ["Lunch — available on request", "VAT"],
    },
    serves_activity_ids: act("dolphin-watching", "snorkelling", "speed-boat-island-run"),
    sort_order: 30,
    seo_title: "Cataspeed — power catamaran charter in Mauritius",
    seo_description:
      "18 m power catamaran for up to 40 guests. Shaded deck, freshwater shower. Available for private charter.",
  },
  {
    id: "c3000000-0000-4000-8000-000000000004",
    slug: "speed-boat",
    name: "Speed boat",
    summary:
      "7.5 m speed boat. Up to 10 guests, for island runs, parasailing and private transfers.",
    description: `Small, quick and easy to charter for a family or a group of friends. We use her for island runs, as the parasailing winch boat and for private transfers along the coast.

Every seat has a grab handle and every guest wears a life jacket while under way.`,
    capacity: 10,
    length_m: 7.5,
    specs: {
      Length: "7.5 m",
      Capacity: "10 guests",
      Crew: "1",
      "Cruising speed": "28 knots",
      Engine: "Outboard, 200 hp",
    },
    hero_image: "cerfs-speedboat",
    gallery: [
      g("cerfs-speedboat", "A yellow speedboat moored beneath trees"),
      g("benitiers-speedboat", "A speedboat at anchor in the lagoon"),
      g("benitiers-boats", "A small boat anchored in calm water"),
      g("benitiers-blue-boat", "A blue boat with a canopy moored in the shallows"),
    ],
    charter_terms: {
      basis: "Two hours, up to 10 guests",
      includes: ["Skipper", "Fuel", "Life jackets", "Water"],
      excludes: ["VAT"],
    },
    serves_activity_ids: act("parasailing", "speed-boat-island-run"),
    sort_order: 40,
    seo_title: "Private speed boat charter in Mauritius",
    seo_description:
      "7.5 m speed boat for up to 10 guests. Island runs, parasailing and private transfers.",
  },
];

export type GalleryPhoto = GalleryItem & {
  category: "Lagoon" | "Underwater" | "Boats" | "Wildlife";
};

export const galleryPhotos: GalleryPhoto[] = [
  {
    path: "hero-le-morne",
    alt: "Le Morne and the underwater waterfall from the air",
    category: "Lagoon",
  },
  {
    path: "crystal-rock",
    alt: "Crystal Rock in the lagoon with Le Morne behind",
    category: "Lagoon",
  },
  { path: "turtle-surface", alt: "A green turtle just below the surface", category: "Wildlife" },
  {
    path: "cerfs-aerial",
    alt: "An island ringed by white sand and turquoise lagoon",
    category: "Lagoon",
  },
  { path: "catamaran-hk40", alt: "A sailing catamaran at sea", category: "Boats" },
  { path: "reef-colour", alt: "Coral reef with small fish", category: "Underwater" },
  { path: "parasail-turquoise", alt: "A parasail over turquoise water", category: "Boats" },
  { path: "biches-sunset", alt: "Small boats against an orange sunset", category: "Boats" },
  { path: "dolphins-pod", alt: "Spinner dolphins under the surface", category: "Wildlife" },
  { path: "bluebay-lagoon", alt: "The turquoise lagoon of Blue Bay", category: "Lagoon" },
  { path: "snorkel-coral", alt: "A snorkeller above a coral head", category: "Underwater" },
  { path: "cerfs-speedboat", alt: "A yellow speedboat moored beneath trees", category: "Boats" },
  { path: "boats-aerial", alt: "Boats on turquoise water from above", category: "Boats" },
  { path: "coral-garden", alt: "Pink and orange soft corals", category: "Underwater" },
  {
    path: "benitiers-le-morne",
    alt: "Lagoon water with Le Morne in the distance",
    category: "Lagoon",
  },
  { path: "turtle-reef", alt: "A green turtle gliding over coral", category: "Wildlife" },
  { path: "grandbaie-boats", alt: "Boats at anchor in a turquoise bay", category: "Boats" },
  { path: "reef-triggerfish", alt: "A titan triggerfish on the reef", category: "Underwater" },
  { path: "bluebay-dawn", alt: "Yachts at anchor at dusk", category: "Boats" },
  { path: "dolphins-coast", alt: "Dolphins surfacing near the coast", category: "Wildlife" },
  {
    path: "biches-aerial",
    alt: "A long turquoise beach and lagoon from the air",
    category: "Lagoon",
  },
  { path: "diver-fish", alt: "A diver among a school of yellow fish", category: "Underwater" },
  { path: "lagoon-palm", alt: "Palm leaves over a turquoise lagoon", category: "Lagoon" },
  { path: "fish-school", alt: "A school of silver fish", category: "Underwater" },
];
