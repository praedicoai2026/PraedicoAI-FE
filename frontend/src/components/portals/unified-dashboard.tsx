"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  BarChart3,
  BriefcaseBusiness,
  GraduationCap,
  RefreshCw,
  Users,
} from "lucide-react";
import { AdminSidebar } from "@/components/portals/workforce-dashboard";

type DashboardAnalytics = {
  generatedAt: string;
  businessEnquiries: number;
  learningEnquiries: number;
  productInterests: number;
  communityEnquiries: number;
  leadStatuses: Array<{ _id: string; count: number }>;
  demos: {
    views: number;
    launches: number;
    successes: number;
    failures: number;
    enquiryConversions: number;
  };
  demoRetentionDays: number;
  employees: number;
  departments: number;
  projects: number;
  projectsByStatus: Array<{ _id: string; count: number }>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isDashboardAnalytics(value: unknown): value is DashboardAnalytics {
  return (
    isRecord(value) &&
    typeof value.generatedAt === "string" &&
    typeof value.businessEnquiries === "number" &&
    typeof value.learningEnquiries === "number" &&
    typeof value.productInterests === "number" &&
    typeof value.communityEnquiries === "number" &&
    Array.isArray(value.leadStatuses) &&
    isRecord(value.demos) &&
    typeof value.demos.views === "number" &&
    typeof value.demos.launches === "number" &&
    typeof value.demos.successes === "number" &&
    typeof value.demos.failures === "number" &&
    typeof value.demos.enquiryConversions === "number" &&
    typeof value.demoRetentionDays === "number" &&
    typeof value.employees === "number" &&
    typeof value.departments === "number" &&
    typeof value.projects === "number" &&
    Array.isArray(value.projectsByStatus)
  );
}

function getErrorMessage(value: unknown) {
  return isRecord(value) &&
    isRecord(value.error) &&
    typeof value.error.message === "string"
    ? value.error.message
    : "The workspace metrics could not be loaded.";
}

export function UnifiedDashboard({ permissions }: { permissions: string[] }) {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    const response = await fetch("/api/admin/reports/dashboard", {
      cache: "no-store",
    });
    if (response.status === 401) {
      router.replace("/admin/login");
      throw new Error("Your session has expired.");
    }
    const result: unknown = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(result));
    const data =
      isRecord(result) && "data" in result && isDashboardAnalytics(result.data)
        ? result.data
        : null;
    if (!data) throw new Error("The reports service returned invalid data.");
    setAnalytics(data);
    setError("");
  }, [router]);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const response = await fetch("/api/admin/reports/dashboard", {
          cache: "no-store",
        });
        if (response.status === 401) {
          router.replace("/admin/login");
          throw new Error("Your session has expired.");
        }
        const result: unknown = await response.json();
        if (!response.ok) throw new Error(getErrorMessage(result));
        const data =
          isRecord(result) &&
          "data" in result &&
          isDashboardAnalytics(result.data)
            ? result.data
            : null;
        if (!data)
          throw new Error("The reports service returned invalid data.");
        if (active) setAnalytics(data);
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "The workspace metrics could not be loaded.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [router]);

  const cards = analytics
    ? [
        {
          label: "Business enquiries",
          value: analytics.businessEnquiries,
          Icon: BriefcaseBusiness,
          detail: "Persisted AI Solutions leads",
        },
        {
          label: "Learning enquiries",
          value: analytics.learningEnquiries,
          Icon: GraduationCap,
          detail: "Persisted training and partnership leads",
        },
        {
          label: "Product interests",
          value: analytics.productInterests,
          Icon: Activity,
          detail: "Enquiries about product concepts",
        },
        {
          label: "Community enquiries",
          value: analytics.communityEnquiries,
          Icon: Users,
          detail: "Persisted community interest requests",
        },
        {
          label: "Demo launches",
          value: analytics.demos.launches,
          Icon: BarChart3,
          detail: `${analytics.demos.views} views in the last ${analytics.demoRetentionDays} days`,
        },
        {
          label: "Employees",
          value: analytics.employees,
          Icon: Users,
          detail: `${analytics.departments} departments`,
        },
        {
          label: "Projects",
          value: analytics.projects,
          Icon: BriefcaseBusiness,
          detail: "Persisted project records",
        },
      ]
    : [];

  return (
    <div className="portal-app lead-admin-app workforce-app">
      <AdminSidebar permissions={permissions} current="reports" />
      <main className="portal-content">
        <header className="portal-topbar">
          <div className="portal-breadcrumb">
            <BarChart3 size={16} aria-hidden="true" />
            <span>Workspace</span>
            <span>/</span>
            <strong>Overview</strong>
          </div>
          <button
            className="lead-admin-refresh"
            type="button"
            onClick={() =>
              void refresh().catch((loadError: unknown) =>
                setError(
                  loadError instanceof Error
                    ? loadError.message
                    : "The workspace metrics could not be loaded.",
                ),
              )
            }
          >
            <RefreshCw size={15} aria-hidden="true" /> Refresh
          </button>
        </header>
        <div className="portal-page-content">
          <section className="lead-admin-panel">
            <div className="lead-admin-panel-heading">
              <div>
                <span className="portal-eyebrow">Operational snapshot</span>
                <h1>Workspace overview</h1>
              </div>
              {analytics && (
                <span>
                  Updated {new Date(analytics.generatedAt).toLocaleString()}
                </span>
              )}
            </div>
            <p className="portal-footer-note">
              Metrics come from saved enquiries, demo usage, employee profiles,
              and projects. Product and community figures represent enquiries,
              not active products or launched programs.
            </p>
            {error && (
              <p className="lead-admin-error" role="alert">
                {error}
              </p>
            )}
            {loading && <p>Loading workspace metrics…</p>}
            {!loading && analytics && (
              <>
                <div className="portal-stat-grid workforce-metric-grid">
                  {cards.map(({ label, value, Icon, detail }) => (
                    <article className="portal-stat-card" key={label}>
                      <span className="portal-stat-icon">
                        <Icon size={17} aria-hidden="true" />
                      </span>
                      <p>{label}</p>
                      <strong>{value}</strong>
                      <small>{detail}</small>
                    </article>
                  ))}
                </div>
                <div className="workforce-report-columns">
                  <section>
                    <h2>Enquiry status</h2>
                    {analytics.leadStatuses.length ? (
                      <ul>
                        {analytics.leadStatuses.map((row) => (
                          <li key={row._id}>
                            <span>{row._id}</span>
                            <strong>{row.count}</strong>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No enquiry records yet.</p>
                    )}
                  </section>
                  <section>
                    <h2>Project status</h2>
                    {analytics.projectsByStatus.length ? (
                      <ul>
                        {analytics.projectsByStatus.map((row) => (
                          <li key={row._id}>
                            <span>{row._id.replace("_", " ")}</span>
                            <strong>{row.count}</strong>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No project records yet.</p>
                    )}
                  </section>
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
