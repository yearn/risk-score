import { init } from "@plausible-analytics/tracker";

// First-party analytics: events post to a same-origin path that the
// Worker (worker.ts) proxies to plausible.io, so domain-based blockers
// never see a third-party request. Only the production host reports, so
// previews and localhost stay out of the stats.
if (location.hostname === "curation.yearn.fi") {
  init({
    domain: "curation.yearn.fi",
    endpoint: "/proxy/plausible/api/event",
    autoCapturePageviews: true,
    outboundLinks: true,
  });
}
