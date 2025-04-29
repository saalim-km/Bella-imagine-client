export function generateRedditStyleSlug(name: string): string {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/^r\//i, "") // remove existing "r/" prefix if any
    .replace(/[\s\W-]+/g, "-") // replace spaces and non-word characters with hyphens
    .replace(/^-+|-+$/g, ""); // trim leading/trailing hyphens

  return `r/${base}`;
}
