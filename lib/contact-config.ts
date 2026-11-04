// Read only from server components and the API route. No recipient address is invented.
export function getFormspreeEndpoint(): string | null {
  const id = process.env.FORMSPREE_FORM_ID?.trim();
  return id && /^[a-zA-Z0-9]{6,32}$/.test(id)
    ? `https://formspree.io/f/${id}`
    : null;
}
