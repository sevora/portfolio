// Detect if text is a URL
export function isUrl(text: string): boolean {
  return /^https?:\/\/[^\s]+$/i.test(text);
}

// Detect if text is an email
export function isEmail(text: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
}

// Get href for a detected link/email
export function getHref(text: string): string | null {
  if (isUrl(text)) {
    return text;
  }
  if (isEmail(text)) {
    return `mailto:${text}`;
  }
  return null;
}
