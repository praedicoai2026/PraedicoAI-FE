"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, RefreshCw, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";

type ContentType =
  | "article"
  | "resource"
  | "event"
  | "product"
  | "research"
  | "community";
type ContentStatus = "draft" | "review" | "published" | "archived";
type ContentEntry = {
  _id: string;
  type: ContentType;
  slug: string;
  title: string;
  summary: string;
  body: string;
  seoTitle: string;
  seoDescription: string;
  status: ContentStatus;
  publishedAt?: string | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getErrorMessage(value: unknown) {
  return isRecord(value) &&
    isRecord(value.error) &&
    typeof value.error.message === "string"
    ? value.error.message
    : "The content request could not be completed.";
}

export function ContentManagementDashboard({
  permissions,
}: {
  permissions: string[];
}) {
  const router = useRouter();
  const [entries, setEntries] = useState<ContentEntry[]>([]);
  const [type, setType] = useState<ContentType>("article");
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [body, setBody] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [status, setStatus] = useState<ContentStatus>("draft");
  const [editingId, setEditingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const refresh = useCallback(async () => {
    const response = await fetch("/api/admin/content", { cache: "no-store" });
    if (response.status === 401) {
      router.replace("/admin/login");
      throw new Error("Your session has expired.");
    }
    const result: unknown = await response.json();
    if (!response.ok) throw new Error(getErrorMessage(result));
    if (!isRecord(result) || !isRecord(result.data) || !Array.isArray(result.data.entries)) {
      throw new Error("The content service returned invalid data.");
    }
    setEntries(result.data.entries as ContentEntry[]);
  }, [router]);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const response = await fetch("/api/admin/content", { cache: "no-store" });
        if (response.status === 401) {
          router.replace("/admin/login");
          throw new Error("Your session has expired.");
        }
        const result: unknown = await response.json();
        if (!response.ok) throw new Error(getErrorMessage(result));
        if (!isRecord(result) || !isRecord(result.data) || !Array.isArray(result.data.entries)) {
          throw new Error("The content service returned invalid data.");
        }
        if (active) setEntries(result.data.entries as ContentEntry[]);
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Content could not be loaded.");
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

  async function createEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch(
        editingId ? `/api/admin/content/${editingId}` : "/api/admin/content",
        {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          slug,
          title,
          summary,
          body,
          seoTitle,
          seoDescription,
          status,
        }),
        },
      );
      const result: unknown = await response.json();
      if (!response.ok) throw new Error(getErrorMessage(result));
      setSlug("");
      setTitle("");
      setSummary("");
      setBody("");
      setSeoTitle("");
      setSeoDescription("");
      setStatus("draft");
      setEditingId("");
      setNotice(editingId ? "Content entry updated and returned to draft." : "Content entry created.");
      await refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Content could not be saved.");
    } finally {
      setSaving(false);
    }
  }

  function editEntry(entry: ContentEntry) {
    setEditingId(entry._id);
    setType(entry.type);
    setSlug(entry.slug);
    setTitle(entry.title);
    setSummary(entry.summary);
    setBody(entry.body);
    setSeoTitle(entry.seoTitle);
    setSeoDescription(entry.seoDescription);
    setStatus("draft");
  }

  async function changeStatus(entry: ContentEntry, nextStatus: ContentStatus) {
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/content/${entry._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const result: unknown = await response.json();
      if (!response.ok) throw new Error(getErrorMessage(result));
      setNotice(`“${entry.title}” moved to ${nextStatus}.`);
      await refresh();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "The workflow change failed.");
    }
  }

  return (
    <div className="portal-app lead-admin-app workforce-app">
      <aside className="portal-sidebar">
        <Link className="portal-sidebar-brand" href="/admin/reports">
          <span className="portal-brand-mark">P<span>.</span></span>
          <span>PraedicoAI<small>CONTENT WORKFLOW</small></span>
        </Link>
        <p className="portal-sidebar-caption">Workspace</p>
        <nav aria-label="Content navigation">
          <Link className="lead-admin-nav is-active" href="/admin/content">
            <FileText size={17} aria-hidden="true" /> Content workflow
          </Link>
          {permissions.includes("reports:read") && (
            <Link className="lead-admin-nav" href="/admin/reports">
              <ShieldCheck size={17} aria-hidden="true" /> Overview
            </Link>
          )}
        </nav>
        <div className="portal-sidebar-bottom">
          <div className="portal-notice"><ShieldCheck size={17} aria-hidden="true" /> Drafts are not public</div>
          <Link className="portal-return" href="/">Return to website</Link>
        </div>
      </aside>
      <main className="portal-content">
        <header className="portal-topbar">
          <div className="portal-breadcrumb"><FileText size={16} aria-hidden="true" /><span>Workspace</span><span>/</span><strong>Content workflow</strong></div>
          <button className="lead-admin-refresh" type="button" onClick={() => void refresh()}>
            <RefreshCw size={15} aria-hidden="true" /> Refresh
          </button>
        </header>
        <div className="portal-page-content">
          <section className="lead-admin-panel">
            <div className="lead-admin-panel-heading">
              <div><span className="portal-eyebrow">Editorial workspace</span><h1>Content workflow</h1></div>
              <span>{entries.length} entries</span>
            </div>
            <p className="portal-footer-note">Manage articles, resources, events, and updates about product, research, and community work. Only published entries appear publicly; core pages remain code-managed.</p>
            {error && <p className="lead-admin-error" role="alert">{error}</p>}
            {notice && <p className="lead-admin-notice" role="status">{notice}</p>}
            {permissions.includes("content:manage") && (
              <form className="lead-admin-editor content-editor" onSubmit={createEntry}>
                <label>Content type<select value={type} onChange={(event) => setType(event.target.value as ContentType)}><option value="article">Article</option><option value="resource">Resource</option><option value="event">Event</option><option value="product">Product update</option><option value="research">Research update</option><option value="community">Community update</option></select></label>
                <label>URL slug<input value={slug} onChange={(event) => setSlug(event.target.value)} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" maxLength={120} /></label>
                <label>Title<input value={title} onChange={(event) => setTitle(event.target.value)} required maxLength={160} /></label>
                <label>Summary<input value={summary} onChange={(event) => setSummary(event.target.value)} required minLength={10} maxLength={400} /></label>
                <label>Body<textarea value={body} onChange={(event) => setBody(event.target.value)} required minLength={20} maxLength={6000} rows={8} /></label>
                <label>SEO title<input value={seoTitle} onChange={(event) => setSeoTitle(event.target.value)} required maxLength={160} /></label>
                <label>SEO description<textarea value={seoDescription} onChange={(event) => setSeoDescription(event.target.value)} required minLength={20} maxLength={300} rows={3} /></label>
                <label>Initial status<select value={status} onChange={(event) => setStatus(event.target.value as ContentStatus)}><option value="draft">Draft</option><option value="review">Submit for review</option>{permissions.includes("content:publish") && <option value="published">Publish now</option>}</select></label>
                <div className="content-form-actions">
                  <button className="button button-primary" type="submit" disabled={saving}>{saving ? "Saving…" : editingId ? "Save as draft" : "Create content"}</button>
                  {editingId && <button className="content-secondary-action" type="button" onClick={() => { setEditingId(""); setSlug(""); setTitle(""); setSummary(""); setBody(""); setSeoTitle(""); setSeoDescription(""); setStatus("draft"); }}>Cancel edit</button>}
                </div>
              </form>
            )}
            <h2 className="content-list-title">Entries</h2>
            {loading ? <p>Loading entries…</p> : entries.length === 0 ? <p>No content entries yet.</p> : (
              <div className="content-entry-list">
                {entries.map((entry) => (
                  <article className="content-entry-card" key={entry._id}>
                    <div><span className={`content-status-badge status-${entry.status}`}>{entry.status}</span><span className="portal-eyebrow">{entry.type}</span><h2>{entry.title}</h2><p>{entry.summary}</p><small>/{entry.slug}</small></div>
                    <div className="content-entry-actions">
                      {permissions.includes("content:manage") && <button type="button" onClick={() => editEntry(entry)}>Edit</button>}
                      {entry.status === "published" && <Link href={`/updates/${entry.slug}`}>View public page</Link>}
                      {entry.status === "draft" && permissions.includes("content:manage") && <button type="button" onClick={() => void changeStatus(entry, "review")}>Submit for review</button>}
                      {entry.status === "review" && permissions.includes("content:publish") && <button type="button" onClick={() => void changeStatus(entry, "published")}>Approve & publish</button>}
                      {entry.status === "published" && permissions.includes("content:publish") && <button type="button" onClick={() => void changeStatus(entry, "archived")}>Archive</button>}
                      {entry.status === "archived" && permissions.includes("content:publish") && <button type="button" onClick={() => void changeStatus(entry, "published")}>Publish again</button>}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
