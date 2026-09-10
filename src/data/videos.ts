export type VideoItem = { title: string; category: string; date: string; youtubeUrl: string; thumbnail?: string };

// Populate only with owner-approved public video links.
export const videos: VideoItem[] = [];
