export const MAX_URL_LENGTH = 2000;

export const isHttpUrl = (value) => {
  if (typeof value !== "string") return false;
  const text = value.trim();
  if (!text || text.length > MAX_URL_LENGTH) return false;
  try {
    const url = new URL(text);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};