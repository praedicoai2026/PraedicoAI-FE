"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowDownToLine,
  BriefcaseBusiness,
  BarChart3,
  GraduationCap,
  FileText,
  LogOut,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { leadCategories } from "@/data/lead-categories";

type LeadStatus =
  | "New"
  | "Contacted"
  | "Qualified"
  | "Proposal/Enrollment"
  | "Converted"
  | "Closed";

type LeadRecord = {
  _id: string;
  category: string;
  vertical: "AI Business Solutions" | "AI Learning";
  recordType: "business" | "registration" | "application" | "partnership";
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  createdAt: string;
  updatedAt: string;
  company?: string;
  institution?: string;
  college?: string;
  designation?: string;
  industry?: string;
  businessProblem?: string;
  requiredAISolution?: string;
  budgetRange?: string;
  preferredContactMethod?: string;
  courseDegree?: string;
  currentYear?: string;
  currentProfession?: string;
  experience?: string;
  interestedAIProgram?: string;
  internshipInterest?: string;
  learningObjectives?: string;
  interestArea?: string;
  partnershipGoal?: string;
  targetAudience?: string;
  estimatedParticipants?: string;
  assignee?: { name?: string; email?: string };
  followUpAt?: string;
  statusHistory?: Array<{
    status: LeadStatus;
    changedAt: string;
    changedBy: string;
  }>;
  notes?: Array<{
    text: string;
    authorName: string;
    authorEmail: string;
    createdAt: string;
  }>;
};

type TeamMember = { name: string; email: string; role: "admin" | "staff" };
type Analytics = {
  total: number;
  byVertical: Array<{ _id: string; count: number }>;
  byStatus: Array<{ _id: string; count: number }>;
  byRecordType: Array<{ _id: string; count: number }>;
};
type LeadEditorState = {
  leadId: string;
  status: LeadStatus;
  assigneeEmail: string;
  followUpAt: string;
  note: string;
};

const statuses: LeadStatus[] = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal/Enrollment",
  "Converted",
  "Closed",
];
const pageSize = 25;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getErrorMessage(value: unknown) {
  if (
    isRecord(value) &&
    isRecord(value.error) &&
    typeof value.error.message === "string"
  ) {
    return value.error.message;
  }
  if (isRecord(value) && typeof value.error === "string") return value.error;
  return "The request could not be completed. Please try again.";
}

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date);
}

function toLocalDateTime(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16);
}

function readCount(rows: Analytics["byRecordType"], key: string) {
  return rows.find((row) => row._id === key)?.count ?? 0;
}

export function LeadManagementDashboard({
  permissions,
}: {
  permissions?: string[];
}) {
  const adminPermissions = permissions ?? [];
  const router = useRouter();
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    total: 0,
    byVertical: [],
    byStatus: [],
    byRecordType: [],
  });
  const [selectedId, setSelectedId] = useState("");
  const [category, setCategory] = useState("");
  const [vertical, setVertical] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saveError, setSaveError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [editorState, setEditorState] = useState<LeadEditorState | null>(null);

  const selectedLead = useMemo(
    () => leads.find((lead) => lead._id === selectedId) ?? null,
    [leads, selectedId],
  );
  const editor = selectedLead
    ? editorState?.leadId === selectedLead._id
      ? editorState
      : {
          leadId: selectedLead._id,
          status: selectedLead.status,
          assigneeEmail: selectedLead.assignee?.email ?? "",
          followUpAt: toLocalDateTime(selectedLead.followUpAt),
          note: "",
        }
    : null;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchInput.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let active = true;
    const query = new URLSearchParams({
      page: String(page),
      limit: String(pageSize),
    });
    if (category) query.set("category", category);
    if (vertical) query.set("vertical", vertical);
    if (statusFilter) query.set("status", statusFilter);
    if (search) query.set("search", search);

    async function load() {
      setLoading(true);
      setError("");
      try {
        const [leadResponse, analyticsResponse, teamResponse] =
          await Promise.all([
            fetch(`/api/admin/leads?${query}`, { cache: "no-store" }),
            fetch("/api/admin/leads/analytics", { cache: "no-store" }),
            fetch("/api/admin/leads/team", { cache: "no-store" }),
          ]);
        if (
          [leadResponse, analyticsResponse, teamResponse].some(
            (response) => response.status === 401,
          )
        ) {
          router.replace("/admin/login");
          return;
        }
        const [leadResult, analyticsResult, teamResult]: unknown[] =
          await Promise.all([
            leadResponse.json(),
            analyticsResponse.json(),
            teamResponse.json(),
          ]);
        if (!leadResponse.ok) throw new Error(getErrorMessage(leadResult));
        if (!analyticsResponse.ok)
          throw new Error(getErrorMessage(analyticsResult));
        if (!teamResponse.ok) throw new Error(getErrorMessage(teamResult));
        if (!active) return;

        const leadData =
          isRecord(leadResult) && isRecord(leadResult.data)
            ? leadResult.data
            : null;
        const analyticsData =
          isRecord(analyticsResult) && isRecord(analyticsResult.data)
            ? analyticsResult.data
            : null;
        const teamData =
          isRecord(teamResult) && isRecord(teamResult.data)
            ? teamResult.data
            : null;
        if (
          !leadData ||
          !Array.isArray(leadData.leads) ||
          typeof leadData.total !== "number" ||
          !analyticsData ||
          typeof analyticsData.total !== "number" ||
          !teamData ||
          !Array.isArray(teamData.team)
        ) {
          throw new Error("The lead service returned an unexpected response.");
        }

        const newLeads = leadData.leads as LeadRecord[];
        setLeads(newLeads);
        setTotal(leadData.total);
        setAnalytics(analyticsData as Analytics);
        setTeam(teamData.team as TeamMember[]);
        setSelectedId((current) =>
          newLeads.some((lead) => lead._id === current)
            ? current
            : (newLeads[0]?._id ?? ""),
        );
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load the lead workspace.",
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
  }, [category, page, refreshKey, router, search, statusFilter, vertical]);

  function updateFilter(
    setter: (value: string) => void,
    value: string,
    resetCategoryPage = true,
  ) {
    setter(value);
    if (resetCategoryPage) setPage(1);
  }

  async function saveLead() {
    if (!selectedLead || !editor) return;
    setBusy(true);
    setSaveError("");
    setNotice("");
    const assignee = team.find(
      (member) => member.email === editor.assigneeEmail,
    );
    const update = {
      status: editor.status,
      assignee: assignee
        ? { name: assignee.name, email: assignee.email }
        : null,
      followUpAt: editor.followUpAt
        ? new Date(editor.followUpAt).toISOString()
        : null,
      ...(editor.note.trim() ? { note: editor.note.trim() } : {}),
    };
    try {
      const response = await fetch(`/api/admin/leads/${selectedLead._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(update),
      });
      const result: unknown = await response.json();
      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }
      if (!response.ok) throw new Error(getErrorMessage(result));
      setNotice("Lead updated.");
      setEditorState(null);
      setRefreshKey((key) => key + 1);
    } catch (saveFailure) {
      setSaveError(
        saveFailure instanceof Error
          ? saveFailure.message
          : "The lead could not be updated.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function exportLeads() {
    setBusy(true);
    setSaveError("");
    setNotice("");
    const query = new URLSearchParams();
    if (category) query.set("category", category);
    if (vertical) query.set("vertical", vertical);
    if (statusFilter) query.set("status", statusFilter);
    if (search) query.set("search", search);
    try {
      const response = await fetch(
        `/api/admin/leads/export${query.size ? `?${query}` : ""}`,
        { cache: "no-store" },
      );
      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }
      if (!response.ok) {
        const result: unknown = await response.json();
        throw new Error(getErrorMessage(result));
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "praedicoai-leads.csv";
      anchor.click();
      URL.revokeObjectURL(url);
      setNotice(
        response.headers.get("x-export-truncated") === "true"
          ? "CSV exported. The export is limited to 10,000 rows; add filters for additional leads."
          : "CSV exported.",
      );
    } catch (exportError) {
      setSaveError(
        exportError instanceof Error
          ? exportError.message
          : "The CSV export could not be created.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    try {
      await fetch("/api/portal-auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portal: "admin" }),
      });
    } finally {
      router.replace("/admin/login");
    }
  }

  const details = selectedLead
    ? [
        ["Category", selectedLead.category],
        [
          "Organization",
          selectedLead.company ??
            selectedLead.institution ??
            selectedLead.college,
        ],
        ["Designation", selectedLead.designation],
        ["Industry", selectedLead.industry],
        ["Business problem", selectedLead.businessProblem],
        ["AI solution requested", selectedLead.requiredAISolution],
        ["Budget", selectedLead.budgetRange],
        ["Preferred contact", selectedLead.preferredContactMethod],
        ["Course / degree", selectedLead.courseDegree],
        ["Current year", selectedLead.currentYear],
        ["Current profession", selectedLead.currentProfession],
        ["Experience", selectedLead.experience],
        ["Interested program", selectedLead.interestedAIProgram],
        ["Internship interest", selectedLead.internshipInterest],
        ["Partnership goal", selectedLead.partnershipGoal],
        ["Target audience", selectedLead.targetAudience],
        ["Estimated participants", selectedLead.estimatedParticipants],
        ["Learning objectives", selectedLead.learningObjectives],
        ["Product or community interest", selectedLead.interestArea],
      ].filter((item): item is [string, string] => Boolean(item[1]))
    : [];

  return (
    <div className="portal-app lead-admin-app">
      <aside className="portal-sidebar">
        <Link
          className="portal-sidebar-brand"
          href="/"
          aria-label="PraedicoAI home"
        >
          <span className="portal-brand-mark">
            P<span>.</span>
          </span>
          <span>
            PraedicoAI
            <small>LEAD WORKSPACE</small>
          </span>
        </Link>
        <p className="portal-sidebar-caption">Administration</p>
        <nav aria-label="Admin navigation">
          <a className="lead-admin-nav is-active" href="#lead-list">
            <Users size={17} aria-hidden="true" /> Enquiries
          </a>
          <a className="lead-admin-nav" href="#lead-analytics">
            <Activity size={17} aria-hidden="true" /> Analytics
          </a>
          {adminPermissions.includes("demos:read") && (
            <Link className="lead-admin-nav" href="/admin/demos">
              <Activity size={17} aria-hidden="true" /> Demo analytics
            </Link>
          )}
          {(adminPermissions.includes("employees:read") ||
            adminPermissions.includes("employees:manage")) && (
            <Link className="lead-admin-nav" href="/admin/employees">
              <Users size={17} aria-hidden="true" /> Employees
            </Link>
          )}
          {(adminPermissions.includes("projects:read") ||
            adminPermissions.includes("projects:manage")) && (
            <Link className="lead-admin-nav" href="/admin/projects">
              <BriefcaseBusiness size={17} aria-hidden="true" /> Projects
            </Link>
          )}
          {adminPermissions.includes("reports:read") && (
            <Link className="lead-admin-nav" href="/admin/reports">
              <BarChart3 size={17} aria-hidden="true" /> Overview
            </Link>
          )}
          {(adminPermissions.includes("content:read") ||
            adminPermissions.includes("content:manage")) && (
            <Link className="lead-admin-nav" href="/admin/content">
              <FileText size={17} aria-hidden="true" /> Content
            </Link>
          )}
          {adminPermissions.includes("admins:manage") && (
            <Link className="lead-admin-nav" href="/admin/team">
              <ShieldCheck size={17} aria-hidden="true" /> Admin accounts
            </Link>
          )}
        </nav>
        <div className="portal-sidebar-bottom">
          <div className="portal-notice">
            <ShieldCheck size={17} aria-hidden="true" />
            Admin-only lead access
          </div>
          <button className="portal-logout" type="button" onClick={signOut}>
            <LogOut size={17} aria-hidden="true" /> Sign out
          </button>
          <Link className="portal-return" href="/">
            Return to website
          </Link>
        </div>
      </aside>

      <div className="portal-content">
        <header className="portal-topbar">
          <div className="portal-breadcrumb">
            <BriefcaseBusiness size={15} aria-hidden="true" />
            <span>Workspace</span>
            <span>/</span>
            <strong>Enquiries</strong>
          </div>
          <span className="portal-env-badge">
            <i /> PRIVATE ADMIN WORKSPACE
          </span>
        </header>

        <main className="portal-main">
          <div className="portal-page-title lead-admin-title">
            <div>
              <p className="portal-eyebrow">PraedicoAI enquiries</p>
              <h1>Lead management</h1>
              <p>
                Review, assign, and follow up on business and learning
                enquiries.
              </p>
            </div>
            <div className="lead-admin-title-actions">
              <button
                className="portal-button portal-button-secondary"
                type="button"
                onClick={() => setRefreshKey((key) => key + 1)}
                disabled={busy || loading}
              >
                <RefreshCw size={15} aria-hidden="true" />
                Refresh
              </button>
              <button
                className="portal-button"
                type="button"
                onClick={exportLeads}
                disabled={busy}
              >
                <ArrowDownToLine size={15} aria-hidden="true" />
                Export CSV
              </button>
            </div>
          </div>

          <section
            className="portal-stat-grid lead-admin-stats"
            id="lead-analytics"
          >
            <article className="portal-stat-card">
              <span className="portal-stat-icon icon-0">
                <Users size={18} aria-hidden="true" />
              </span>
              <p>Total enquiries</p>
              <strong>{analytics.total}</strong>
              <small>All categories</small>
            </article>
            <article className="portal-stat-card">
              <span className="portal-stat-icon icon-1">
                <BriefcaseBusiness size={18} aria-hidden="true" />
              </span>
              <p>Business solutions</p>
              <strong>
                {analytics.byVertical.find(
                  (row) => row._id === "AI Business Solutions",
                )?.count ?? 0}
              </strong>
              <small>Consulting, automation, and applications</small>
            </article>
            <article className="portal-stat-card">
              <span className="portal-stat-icon icon-2">
                <GraduationCap size={18} aria-hidden="true" />
              </span>
              <p>Training enquiries</p>
              <strong>
                {readCount(analytics.byRecordType, "registration")}
              </strong>
              <small>Student and professional program requests</small>
            </article>
            <article className="portal-stat-card">
              <span className="portal-stat-icon icon-3">
                <Activity size={18} aria-hidden="true" />
              </span>
              <p>Internship enquiries</p>
              <strong>
                {readCount(analytics.byRecordType, "application")}
              </strong>
              <small>Requests to discuss internship tracks</small>
            </article>
          </section>

          {error && (
            <p className="lead-admin-alert error" role="alert">
              {error}
            </p>
          )}
          {notice && (
            <p className="lead-admin-alert success" role="status">
              {notice}
            </p>
          )}

          <section
            className="portal-panel lead-admin-list-panel"
            id="lead-list"
          >
            <div className="portal-panel-heading lead-admin-panel-heading">
              <div>
                <h2>Enquiries</h2>
                <p>
                  {total} record{total === 1 ? "" : "s"} · Filter and select a
                  record to manage it.
                </p>
              </div>
              <div className="lead-admin-filters">
                <label className="portal-search">
                  <Search size={16} aria-hidden="true" />
                  <span className="visually-hidden">Search leads</span>
                  <input
                    value={searchInput}
                    onChange={(event) =>
                      updateFilter(setSearchInput, event.target.value)
                    }
                    placeholder="Search name or email"
                  />
                </label>
                <label>
                  <span className="visually-hidden">Filter by vertical</span>
                  <select
                    value={vertical}
                    onChange={(event) =>
                      updateFilter(setVertical, event.target.value)
                    }
                  >
                    <option value="">All verticals</option>
                    <option value="AI Business Solutions">
                      AI Business Solutions
                    </option>
                    <option value="AI Learning">AI Learning</option>
                  </select>
                </label>
                <label>
                  <span className="visually-hidden">Filter by category</span>
                  <select
                    value={category}
                    onChange={(event) =>
                      updateFilter(setCategory, event.target.value)
                    }
                  >
                    <option value="">All categories</option>
                    {leadCategories.map((item) => (
                      <option key={item.category} value={item.category}>
                        {item.category}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className="visually-hidden">Filter by status</span>
                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      updateFilter(setStatusFilter, event.target.value)
                    }
                  >
                    <option value="">All statuses</option>
                    {statuses.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
            <div className="portal-table-scroll">
              <table className="portal-table lead-admin-table">
                <thead>
                  <tr>
                    <th>Contact</th>
                    <th>Category</th>
                    <th>Vertical</th>
                    <th>Status</th>
                    <th>Assignee</th>
                    <th>Received</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr
                      className={selectedId === lead._id ? "is-selected" : ""}
                      key={lead._id}
                      onClick={() => setSelectedId(lead._id)}
                    >
                      <td>
                        <button
                          className="lead-contact-button"
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedId(lead._id);
                          }}
                        >
                          <strong>{lead.name}</strong>
                          <span>{lead.email}</span>
                        </button>
                      </td>
                      <td>{lead.category}</td>
                      <td>{lead.vertical}</td>
                      <td>
                        <span
                          className={`portal-status lead-status-${lead.status.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td>{lead.assignee?.name ?? "Unassigned"}</td>
                      <td>{formatDate(lead.createdAt)}</td>
                    </tr>
                  ))}
                  {!loading && leads.length === 0 && (
                    <tr>
                      <td colSpan={6} className="lead-admin-empty">
                        No enquiries match these filters.
                      </td>
                    </tr>
                  )}
                  {loading && (
                    <tr>
                      <td colSpan={6} className="lead-admin-empty">
                        Loading enquiries…
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="lead-admin-pagination">
              <span>
                {total === 0 ? 0 : (page - 1) * pageSize + 1}–
                {Math.min(page * pageSize, total)} of {total}
              </span>
              <div>
                <button
                  type="button"
                  className="portal-button portal-button-secondary"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                >
                  Previous
                </button>
                <span>
                  Page {page} of {pageCount}
                </span>
                <button
                  type="button"
                  className="portal-button portal-button-secondary"
                  disabled={page >= pageCount || loading}
                  onClick={() =>
                    setPage((value) => Math.min(pageCount, value + 1))
                  }
                >
                  Next
                </button>
              </div>
            </div>
          </section>

          {selectedLead && editor && (
            <section className="portal-panel lead-detail-panel">
              <div className="portal-panel-heading">
                <div>
                  <h2>{selectedLead.name}</h2>
                  <p>
                    {selectedLead.email} · {selectedLead.phone} · Received{" "}
                    {formatDate(selectedLead.createdAt)}
                  </p>
                </div>
                <span className="portal-status">{selectedLead.category}</span>
              </div>
              <div className="lead-detail-layout">
                <div>
                  <h3>Enquiry details</h3>
                  <dl className="lead-detail-list">
                    {details.map(([label, value]) => (
                      <div key={label}>
                        <dt>{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <h3 className="lead-history-title">Status history</h3>
                  <ol className="lead-history">
                    {(selectedLead.statusHistory ?? []).map((item, index) => (
                      <li key={`${item.changedAt}-${index}`}>
                        <strong>{item.status}</strong>
                        <span>
                          {formatDate(item.changedAt)} · {item.changedBy}
                        </span>
                      </li>
                    ))}
                  </ol>
                  {(selectedLead.notes ?? []).length > 0 && (
                    <>
                      <h3 className="lead-history-title">Notes</h3>
                      <ul className="lead-notes">
                        {[...(selectedLead.notes ?? [])]
                          .reverse()
                          .map((item, index) => (
                            <li key={`${item.createdAt}-${index}`}>
                              <p>{item.text}</p>
                              <small>
                                {item.authorName} · {formatDate(item.createdAt)}
                              </small>
                            </li>
                          ))}
                      </ul>
                    </>
                  )}
                </div>
                <div className="lead-editor">
                  <h3>Manage follow-up</h3>
                  <label>
                    Lead status
                    <select
                      value={editor.status}
                      onChange={(event) =>
                        setEditorState({
                          ...editor,
                          status: event.target.value as LeadStatus,
                        })
                      }
                    >
                      {statuses.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Assign to team member
                    <select
                      value={editor.assigneeEmail}
                      onChange={(event) =>
                        setEditorState({
                          ...editor,
                          assigneeEmail: event.target.value,
                        })
                      }
                    >
                      <option value="">Unassigned</option>
                      {team.map((member) => (
                        <option key={member.email} value={member.email}>
                          {member.name} ({member.email})
                        </option>
                      ))}
                    </select>
                  </label>
                  {team.length === 0 && (
                    <p className="lead-team-hint">
                      No team members are provisioned yet. Use the backend team
                      role command to add authorized assignees.
                    </p>
                  )}
                  <label>
                    Follow-up date and time
                    <input
                      type="datetime-local"
                      value={editor.followUpAt}
                      onChange={(event) =>
                        setEditorState({
                          ...editor,
                          followUpAt: event.target.value,
                        })
                      }
                    />
                  </label>
                  <label>
                    Add a note
                    <textarea
                      rows={4}
                      maxLength={2000}
                      value={editor.note}
                      onChange={(event) =>
                        setEditorState({
                          ...editor,
                          note: event.target.value,
                        })
                      }
                      placeholder="Record the conversation or next step"
                    />
                  </label>
                  {saveError && (
                    <p className="lead-admin-alert error" role="alert">
                      {saveError}
                    </p>
                  )}
                  <button
                    className="portal-button"
                    type="button"
                    disabled={busy}
                    onClick={saveLead}
                  >
                    {busy ? "Saving..." : "Save updates"}
                  </button>
                </div>
              </div>
            </section>
          )}

          <p className="portal-footer-note lead-admin-footnote">
            Enquiry data is visible to authorized administrators only. CSV
            exports are limited to 10,000 rows per request.
          </p>
        </main>
      </div>
    </div>
  );
}
