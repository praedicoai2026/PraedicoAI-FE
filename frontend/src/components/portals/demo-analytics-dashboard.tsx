"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  BriefcaseBusiness,
  Eye,
  Play,
  RefreshCw,
  ShieldCheck,
  MessageSquareText,
  Users,
  FileText,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type UsageTotals = {
  views: number;
  launches: number;
  successes: number;
  failures: number;
};
type DemoUsageRow = {
  _id:
    | string
    | {
        slug?: string;
        category?: string;
      };
  views: number;
  launches: number;
  successes: number;
  failures: number;
  enquiryConversions?: number;
};
type Analytics = {
  totals: UsageTotals & { enquiryConversions: number };
  byDemo: DemoUsageRow[];
  byCategory: DemoUsageRow[];
  retentionDays: number;
};

function isAnalytics(value: unknown): value is Analytics {
  return (
    typeof value === "object" &&
    value !== null &&
    "totals" in value &&
    typeof value.totals === "object" &&
    value.totals !== null &&
    "byDemo" in value &&
    Array.isArray(value.byDemo) &&
    "byCategory" in value &&
    Array.isArray(value.byCategory) &&
    "retentionDays" in value &&
    typeof value.retentionDays === "number"
  );
}

function labelFor(row: DemoUsageRow) {
  if (typeof row._id === "string") return row._id;
  return row._id.slug ?? row._id.category ?? "Unknown";
}

export function DemoAnalyticsDashboard({
  permissions,
}: {
  permissions: string[];
}) {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const statCards: Array<{ label: string; count: number; Icon: LucideIcon }> =
    analytics
      ? [
          { label: "Views", count: analytics.totals.views, Icon: Eye },
          { label: "Launches", count: analytics.totals.launches, Icon: Play },
          {
            label: "Successful runs",
            count: analytics.totals.successes,
            Icon: BarChart3,
          },
          {
            label: "Failed runs",
            count: analytics.totals.failures,
            Icon: ShieldCheck,
          },
          {
            label: "Enquiry conversions",
            count: analytics.totals.enquiryConversions,
            Icon: MessageSquareText,
          },
        ]
      : [];

  const requestAnalytics = useCallback(async () => {
    const response = await fetch("/api/admin/demos/analytics", {
      cache: "no-store",
    });
    if (response.status === 401) {
      router.replace("/admin/login");
      throw new Error("Your admin session has expired.");
    }
    const result: unknown = await response.json();
    if (!response.ok) {
      throw new Error(
        "The demo analytics could not be loaded. Please try again.",
      );
    }
    const data =
      typeof result === "object" &&
      result !== null &&
      "data" in result &&
      isAnalytics(result.data)
        ? result.data
        : null;
    if (!data) throw new Error("The demo analytics response was invalid.");
    return data;
  }, [router]);

  async function load() {
    setLoading(true);
    setError("");
    try {
      setAnalytics(await requestAnalytics());
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "The demo analytics could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let active = true;
    void requestAnalytics()
      .then((data) => {
        if (active) setAnalytics(data);
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "The demo analytics could not be loaded.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [requestAnalytics]);

  return (
    <div className="portal-app lead-admin-app">
      <aside className="portal-sidebar">
        <Link className="portal-sidebar-brand" href="/admin/dashboard">
          <span className="portal-brand-mark">
            P<span>.</span>
          </span>
          <span>
            PraedicoAI
            <small>ADMIN WORKSPACE</small>
          </span>
        </Link>
        <p className="portal-sidebar-caption">Administration</p>
        <nav aria-label="Admin navigation">
          {permissions.includes("leads:read") && (
            <Link className="lead-admin-nav" href="/admin/dashboard">
              <ArrowLeft size={17} aria-hidden="true" /> Enquiries
            </Link>
          )}
          <Link className="lead-admin-nav is-active" href="/admin/demos">
            <BarChart3 size={17} aria-hidden="true" /> Demo analytics
          </Link>
          {(permissions.includes("employees:read") ||
            permissions.includes("employees:manage")) && (
            <Link className="lead-admin-nav" href="/admin/employees">
              <Users size={17} aria-hidden="true" /> Employees
            </Link>
          )}
          {(permissions.includes("projects:read") ||
            permissions.includes("projects:manage")) && (
            <Link className="lead-admin-nav" href="/admin/projects">
              <BriefcaseBusiness size={17} aria-hidden="true" /> Projects
            </Link>
          )}
          {permissions.includes("admins:manage") && (
            <Link className="lead-admin-nav" href="/admin/team">
              <ShieldCheck size={17} aria-hidden="true" /> Admin accounts
            </Link>
          )}
          {permissions.includes("reports:read") && (
            <Link className="lead-admin-nav" href="/admin/reports">
              <BarChart3 size={17} aria-hidden="true" /> Overview
            </Link>
          )}
          {(permissions.includes("content:read") ||
            permissions.includes("content:manage")) && (
            <Link className="lead-admin-nav" href="/admin/content">
              <FileText size={17} aria-hidden="true" /> Content
            </Link>
          )}
        </nav>
        <div className="portal-sidebar-bottom">
          <div className="portal-notice">
            <ShieldCheck size={17} aria-hidden="true" />
            Admin-only analytics
          </div>
          <Link className="portal-return" href="/">
            Return to website
          </Link>
        </div>
      </aside>
      <div className="portal-content">
        <header className="portal-topbar">
          <div className="portal-breadcrumb">
            <BarChart3 size={15} aria-hidden="true" />
            <span>Workspace</span>
            <span>/</span>
            <strong>Demo analytics</strong>
          </div>
          <span className="portal-env-badge">
            <i /> PRIVATE ADMIN WORKSPACE
          </span>
        </header>
        <main className="portal-main">
          <div className="portal-page-title lead-admin-title">
            <div>
              <p className="portal-eyebrow">Demo Center</p>
              <h1>Usage analytics</h1>
              <p>
                Aggregate demo engagement and submitted enquiries attributed to
                demo pages. Prompts and generated responses are not stored.
              </p>
            </div>
            <button
              className="portal-button portal-button-secondary"
              type="button"
              onClick={() => void load()}
              disabled={loading}
            >
              <RefreshCw size={15} aria-hidden="true" />
              Refresh
            </button>
          </div>
          {error && (
            <p className="portal-error" role="alert">
              {error}
            </p>
          )}
          {loading && <p role="status">Loading demo analytics...</p>}
          {analytics && (
            <>
              <section className="portal-stat-grid lead-admin-stats">
                {statCards.map(({ label, count, Icon: StatIcon }, index) => {
                  return (
                    <article className="portal-stat-card" key={label}>
                      <span className={`portal-stat-icon icon-${index}`}>
                        <StatIcon size={18} aria-hidden="true" />
                      </span>
                      <p>{label}</p>
                      <strong>{count}</strong>
                      <small>
                        Events retained for {analytics.retentionDays} days
                      </small>
                    </article>
                  );
                })}
              </section>
              <section className="portal-panel demo-analytics-panel">
                <div className="portal-panel-heading">
                  <div>
                    <p className="portal-eyebrow">Engagement</p>
                    <h2>By demo</h2>
                  </div>
                </div>
                {analytics.byDemo.length ? (
                  <div className="demo-analytics-table-wrap">
                    <table className="demo-analytics-table">
                      <thead>
                        <tr>
                          <th>Demo</th>
                          <th>Views</th>
                          <th>Launches</th>
                          <th>Successes</th>
                          <th>Failures</th>
                          <th>Enquiry conversions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.byDemo.map((row) => (
                          <tr key={labelFor(row)}>
                            <th scope="row">{labelFor(row)}</th>
                            <td>{row.views}</td>
                            <td>{row.launches}</td>
                            <td>{row.successes}</td>
                            <td>{row.failures}</td>
                            <td>{row.enquiryConversions ?? 0}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="muted">
                    No usage events have been recorded yet.
                  </p>
                )}
              </section>
              <section className="portal-panel demo-analytics-panel">
                <div className="portal-panel-heading">
                  <div>
                    <p className="portal-eyebrow">Popularity</p>
                    <h2>By category</h2>
                  </div>
                </div>
                {analytics.byCategory.length ? (
                  <div className="demo-category-analytics">
                    {analytics.byCategory.map((row) => (
                      <article key={labelFor(row)}>
                        <h3>{labelFor(row)}</h3>
                        <p>
                          {row.views} views · {row.launches} launches
                        </p>
                        <small>
                          {row.successes} successful · {row.failures} failed
                        </small>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="muted">
                    Category analytics will appear after the first demo visit.
                  </p>
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
