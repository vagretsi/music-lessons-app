// Keep stored values stable; translate only the labels shown to the user.
export const INSTRUMENTS = [
  "Bouzouki", "Guitar", "Piano", "Bass", "Drums", "Violin", "Cello",
  "Trumpet", "Saxophone", "Voice", "Ukulele",
];
const greek: Record<string, string> = {
  Bouzouki: "Μπουζούκι", Guitar: "Κιθάρα", Piano: "Πιάνο", Bass: "Μπάσο",
  Drums: "Ντραμς", Violin: "Βιολί", Cello: "Βιολοντσέλο", Trumpet: "Τρομπέτα",
  Saxophone: "Σαξόφωνο", Voice: "Τραγούδι", Ukulele: "Γιουκαλίλι", Other: "Άλλο",
};
export function instrumentLabel(value: string, locale: "el" | "en") {
  return locale === "el" ? greek[value] ?? value : value;
}
