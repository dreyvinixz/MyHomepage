export type UpdateCategory = 'article' | 'youtube' | 'instagram' | 'linkedin';
export type LocalizedText = { en: string; pt: string };
export type Update = {
  slug: string;
  date: string; // YYYY-MM-DD
  category: UpdateCategory;
  title: LocalizedText;
  summary: LocalizedText;
  /** External URL for a social post or video. Omit for an article on this site. */
  url?: string;
  /** Paragraphs for articles hosted on this site. */
  body?: { en: string[]; pt: string[] };
};

// Add published entries here; see README.md for the format.
export const updates: Update[] = [];
