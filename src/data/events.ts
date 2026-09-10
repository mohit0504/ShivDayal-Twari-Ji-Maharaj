export type EventItem = { slug: string; category: "Katha" | "Satsang" | "Bhajan" | "Special"; title: string; date: string; time?: string; location: string; description: string; image?: string };

// Add verified event details here before publication. No dates have been supplied yet.
export const events: EventItem[] = [];
