/** Lower-cases and strips accents so "ital" finds "Italy" and "yildiz" finds "Yıldız". */
export function fold(s: string): string {
  return s
    .toLocaleLowerCase('en')
    .replace(/ı/g, 'i')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim();
}
