export const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const skillPattern = (skill) =>
  new RegExp(`(^|[^a-z0-9+#])${escapeRegex(skill)}($|[^a-z0-9+#])`, "i");