export type AudioItem = { title: string; category: string; audioUrl: string; artwork?: string };

// Populate only with owner-approved audio URLs.
export const audios: AudioItem[] = [];
