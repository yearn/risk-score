import { init } from "@plausible-analytics/tracker";

// Explicit build opt-in. The preview Worker independently suppresses events.
if (import.meta.env.PUBLIC_ANALYTICS_ENABLED === "true") {
  init({
    domain: "curation.yearn.fi",
    endpoint: "/proxy/plausible/api/event",
    autoCapturePageviews: true,
    outboundLinks: true,
  });
}
