// ─────────────────────────────────────────────────────────────
//  Places shown in the Maps app.
//
//  1. Add a place below (lat/lng: right-click the spot in Google Maps → click the numbers to copy them).
//  2. Put its photos in  src/lib/assets/travel/<id>/   e.g. src/lib/assets/travel/rome/1.jpg
//     They're picked up automatically, in file-name order.
// ─────────────────────────────────────────────────────────────

export interface Place {
  id: string;        // also the photo folder name
  name: string;
  country: string;
  lat: number;
  lng: number;
  date?: string;     // free text, e.g. 'August 2024'
  note?: string;     // one or two sentences
}

export const places: Place[] = [
  // Example with optional fields:
  // { id: 'rome', name: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964, date: 'August 2024', note: 'First time in Italy.' },
  { id: 'helsinki',  name: 'Helsinki',  country: 'Finland',     lat: 60.1699, lng: 24.9384 },
  { id: 'vantaa',    name: 'Vantaa',    country: 'Finland',     lat: 60.2934, lng: 25.0378 },
  { id: 'espoo',     name: 'Espoo',     country: 'Finland',     lat: 60.2055, lng: 24.6559 },
  { id: 'turku',     name: 'Turku',     country: 'Finland',     lat: 60.4518, lng: 22.2666 },
  { id: 'stockholm', name: 'Stockholm', country: 'Sweden',      lat: 59.3293, lng: 18.0686 },
  { id: 'tallinn',   name: 'Tallinn',   country: 'Estonia',     lat: 59.4370, lng: 24.7536 },
  { id: 'rome',      name: 'Rome',      country: 'Italy',       lat: 41.9028, lng: 12.4964 },
  { id: 'milan',     name: 'Milan',     country: 'Italy',       lat: 45.4642, lng: 9.1900 },
  { id: 'amsterdam', name: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041 },
  { id: 'berlin',    name: 'Berlin',    country: 'Germany',     lat: 52.5200, lng: 13.4050 },
  { id: 'paris',     name: 'Paris',     country: 'France',      lat: 48.8566, lng: 2.3522 },
  { id: 'brussels',  name: 'Brussels',  country: 'Belgium',     lat: 50.8503, lng: 4.3517 },

  { id: 'istanbul',      name: 'Istanbul',      country: 'Türkiye', lat: 41.0082, lng: 28.9784 },
  { id: 'ankara',        name: 'Ankara',        country: 'Türkiye', lat: 39.9334, lng: 32.8597 },
  { id: 'eskisehir',     name: 'Eskişehir',     country: 'Türkiye', lat: 39.7767, lng: 30.5206 },
  { id: 'kayseri',       name: 'Kayseri',       country: 'Türkiye', lat: 38.7205, lng: 35.4826 },
  { id: 'antalya',       name: 'Antalya',       country: 'Türkiye', lat: 36.8969, lng: 30.7133 },
  { id: 'mersin',        name: 'Mersin',        country: 'Türkiye', lat: 36.8121, lng: 34.6415 },
  { id: 'gaziantep',     name: 'Gaziantep',     country: 'Türkiye', lat: 37.0662, lng: 37.3833 },
  { id: 'kahramanmaras', name: 'Kahramanmaraş', country: 'Türkiye', lat: 37.5753, lng: 36.9228 },
  { id: 'samsun',        name: 'Samsun',        country: 'Türkiye', lat: 41.2867, lng: 36.3300 },
  { id: 'ordu',          name: 'Ordu',          country: 'Türkiye', lat: 40.9839, lng: 37.8764 },
  { id: 'giresun',       name: 'Giresun',       country: 'Türkiye', lat: 40.9128, lng: 38.3895 },
  { id: 'trabzon',       name: 'Trabzon',       country: 'Türkiye', lat: 41.0027, lng: 39.7168 },
  { id: 'gumushane',     name: 'Gümüşhane',     country: 'Türkiye', lat: 40.4603, lng: 39.4814 },
  { id: 'rize',          name: 'Rize',          country: 'Türkiye', lat: 41.0201, lng: 40.5234 },
  { id: 'kars',          name: 'Kars',          country: 'Türkiye', lat: 40.6013, lng: 43.0975 },
];

// ── photos (automatic) ──────────────────────────────────────

export interface Photo {
  src: string;
  name: string;
}

const files = import.meta.glob('$lib/assets/travel/*/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const byPlace: Record<string, Photo[]> = {};
for (const [path, src] of Object.entries(files)) {
  const [, folder, file] = path.match(/travel\/([^/]+)\/([^/]+)$/) ?? [];
  if (!folder) continue;
  (byPlace[folder] ??= []).push({ src, name: file });
}
for (const list of Object.values(byPlace)) {
  list.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
}

export function photosFor(id: string): Photo[] {
  return byPlace[id] ?? [];
}
