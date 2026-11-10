import { isGa4MeasurementId } from "./analytics-config";
import { SITE_NAME, SITE_URL } from "./site-config";
import { getOfficialLineUrl, CONTACT_TEL } from "./contact";

declare global {
  interface Window {
    dataLayer?: unknown[];
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}
let initialized = false;
let stopActive: (() => void) | undefined;

/** Called only after opt-in. No URL queries, phone numbers or arbitrary text enter events. */
export function startAnalytics(id: string, browser = window, root = document): () => void {
  if (!isGa4MeasurementId(id)) return () => {};
  stopActive?.();
  const analytics = browser;
  const disableKey = `ga-disable-${id}` as const;
  analytics[disableKey] = false;
  analytics.dataLayer ??= [];
  function command(..._args: unknown[]) { analytics.dataLayer!.push(arguments); }
  if (!initialized) {
    command("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  }
  command("consent", "update", { analytics_storage: "granted" });
  if (!initialized) {
    command("js", new Date());
    command("config", id, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: `${SITE_URL}/`, page_referrer: "", page_title: SITE_NAME,
    });
    command("event", "page_view", { page_location: `${SITE_URL}/`, page_referrer: "", page_title: SITE_NAME });
    const script = root.createElement("script");
    script.id = "program-ga4";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
    root.head.appendChild(script);
    initialized = true;
  }
  const onClick = (event: MouseEvent) => {
    const anchor = (event.target as Element | null)?.closest?.("a[href]");
    const href = anchor?.getAttribute("href");
    const eventName = href === CONTACT_TEL ? "phone_click"
      : href && href === getOfficialLineUrl() ? "line_click"
      : href === "/recruitment/first" ? "cohort_visit"
      : href && /^https:\/\/(www\.)?youtube\.com\/watch\?v=[A-Za-z0-9_-]+$/.test(href) ? "youtube_click"
      : href && /^https:\/\/(www\.)?instagram\.com\//.test(href) ? "instagram_click"
      : href === "#contact" && anchor?.closest(".faq-consultation") ? "faq_consultation" : null;
    if (!anchor || !eventName) return;
    const location = anchor.closest(".mobile-consult-bar") ? "sticky"
      : anchor.closest(".renewal-hero") ? "hero"
      : anchor.closest("#roadmap") ? "roadmap"
      : anchor.closest("#courses") ? "courses"
      : anchor.closest("#contact") ? "contact"
      : anchor.closest(".home-footer") ? "footer" : "other";
    command("event", eventName, { location, page_location: `${SITE_URL}/`, page_referrer: "" });
  };
  root.addEventListener("click", onClick, { capture: true });
  const stop = () => {
    root.removeEventListener("click", onClick, { capture: true });
    if (stopActive !== stop) return;
    analytics[disableKey] = true;
    command("consent", "update", { analytics_storage: "denied" });
    stopActive = undefined;
  };
  stopActive = stop;
  return stop;
}
