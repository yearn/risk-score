import { init } from "@plausible-analytics/tracker";

// First-party analytics: events post to a same-origin path that a
// vercel.json rewrite proxies to plausible.io, so domain-based blockers
// never see a third-party request. Localhost capture is off by default.
init({
  domain: "curation.yearn.fi",
  endpoint: "/proxy/plausible/api/event",
  autoCapturePageviews: true,
  outboundLinks: true,
});
