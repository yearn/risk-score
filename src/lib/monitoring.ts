// Client + types for the monitoring alerts API, consumed through the `/api/monitoring` edge
// proxy (see api/monitoring.ts). The shapes mirror the backend contract in
// github.com/yearn/monitoring `api/server.py` / `deploy/alerts-api.md` (PR #273).
//
// All fetching happens in the browser so the static site stays decoupled from backend uptime —
// do not call these at build time.

export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface AlertEvent {
  id: number;
  created_at: string;
  source: string;
  protocol: string;
  channel: string;
  severity: Severity;
  message: string;
  plain_text: boolean;
  silent: boolean;
  delivery_status: string;
  delivered_at: string | null;
  delivery_error: string | null;
  metadata: Record<string, unknown> | null;
}

export interface AlertsResponse {
  data: AlertEvent[];
  next_cursor: string | null;
  limit: number;
}

export interface AlertsQuery {
  protocol?: string;
  severity?: Severity;
  source?: string;
  from?: string;
  to?: string;
  cursor?: string;
  limit?: number;
}

export interface ProtocolTask {
  name: string;
  script: string;
  args: Record<string, string>;
  profile: string;
  cron: string;
}

export interface ProtocolEntry {
  name: string;
  tasks: ProtocolTask[];
}

export interface ProtocolsResponse {
  data: ProtocolEntry[];
  count: number;
}

export interface SeverityStyle {
  emoji: string;
  label: string;
  color: string;
}

// Mirrors the backend severity ladder in utils/alert.py.
export const SEVERITY_META: Record<Severity, SeverityStyle> = {
  LOW: { emoji: "ℹ️", label: "Low", color: "#3B82F6" },
  MEDIUM: { emoji: "⚠️", label: "Medium", color: "#FACC15" },
  HIGH: { emoji: "🚨", label: "High", color: "#FB923C" },
  CRITICAL: { emoji: "🔴", label: "Critical", color: "#EF4444" },
};

const FALLBACK_SEVERITY: SeverityStyle = { emoji: "•", label: "Unknown", color: "#9CA3AF" };

export function severityMeta(severity: string): SeverityStyle {
  return SEVERITY_META[severity as Severity] ?? { ...FALLBACK_SEVERITY, label: severity || "Unknown" };
}

const API_BASE = "/api/monitoring";

function buildQuery(query: Record<string, string | number | undefined | null>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function fetchAlerts(query: AlertsQuery = {}, init?: RequestInit): Promise<AlertsResponse> {
  const res = await fetch(`${API_BASE}/alerts${buildQuery(query)}`, init);
  if (!res.ok) {
    throw new Error(`alerts request failed: ${res.status}`);
  }
  return (await res.json()) as AlertsResponse;
}

export async function fetchProtocols(init?: RequestInit): Promise<ProtocolsResponse> {
  const res = await fetch(`${API_BASE}/protocols`, init);
  if (!res.ok) {
    throw new Error(`protocols request failed: ${res.status}`);
  }
  return (await res.json()) as ProtocolsResponse;
}

// Buckets a newest-first alert list into the most recent alert per protocol.
export function latestByProtocol(alerts: AlertEvent[]): Map<string, AlertEvent> {
  const latest = new Map<string, AlertEvent>();
  for (const alert of alerts) {
    if (!latest.has(alert.protocol)) {
      latest.set(alert.protocol, alert);
    }
  }
  return latest;
}

export function formatRelativeTime(iso: string, now: number = Date.now()): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const sec = Math.round((now - then) / 1000);
  if (sec < 45) return "just now";
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 30) return `${day}d ago`;
  const mo = Math.round(day / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.round(mo / 12)}y ago`;
}

const ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

// Escape untrusted alert text before injecting it into innerHTML.
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ESCAPE_MAP[c]);
}

export function truncate(value: string, max = 140): string {
  return value.length > max ? `${value.slice(0, max - 1).trimEnd()}…` : value;
}

export function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
