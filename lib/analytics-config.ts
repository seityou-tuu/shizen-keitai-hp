export function isGa4MeasurementId(value: string): boolean {
  return /^G-[A-Z0-9]{6,20}$/.test(value);
}

// Environment values are read at build time. No ID, preview, or no approval => off.
export function getGa4MeasurementId(env = process.env): string | null {
  const id = env.GA4_MEASUREMENT_ID?.trim() ?? "";
  return env.VERCEL_ENV === "production" && env.GA4_ENABLED === "true" && isGa4MeasurementId(id)
    ? id : null;
}

// Public ownership token. An explicit environment value overrides this default;
// an empty value disables the tag. Preview and development never emit it.
const GOOGLE_SITE_VERIFICATION_DEFAULT = "CXdSC9XNyiLa8xhu5__h3wkcnVnNHAjGJ0BEU2JW3LU";

export function getGoogleVerification(env = process.env): string | undefined {
  const token = (env.GOOGLE_SITE_VERIFICATION ?? GOOGLE_SITE_VERIFICATION_DEFAULT).trim();
  return env.VERCEL_ENV === "production" && /^[A-Za-z0-9_-]{20,256}$/.test(token)
    ? token : undefined;
}
