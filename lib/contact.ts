// Public contact details only. Never put account credentials or tokens here.
export const CONTACT_PHONE = "0985-74-7643";
export const CONTACT_TEL = `tel:${CONTACT_PHONE.replace(/\D/g, "")}`;

// Set only after the operator opens and verifies the official LINE account.
// One edit updates every LINE consultation link. Blank means hidden everywhere.
export const OFFICIAL_LINE_URL: string = "https://lin.ee/O3tJo01";

export function getOfficialLineUrl(
  value: string = OFFICIAL_LINE_URL,
): string | null {
  if (!value.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" || url.username || url.password || url.port)
      return null;
    const shortLink =
      url.hostname === "lin.ee" && /^\/[a-zA-Z0-9]+\/?$/.test(url.pathname);
    const addFriendLink =
      url.hostname === "line.me" &&
      /^\/(?:R\/)?ti\/p\/(?:@|%40)?[a-zA-Z0-9._-]+\/?$/i.test(url.pathname);
    return shortLink || addFriendLink ? url.href : null;
  } catch {
    return null;
  }
}
