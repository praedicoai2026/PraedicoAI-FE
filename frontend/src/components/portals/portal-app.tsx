"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  ArrowDown,
  ArrowUp,
  Bell,
  BriefcaseBusiness,
  Check,
  ChevronRight,
  CircleHelp,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  ShieldCheck,
  Users,
  Workflow,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";

type PortalKind = "admin" | "demo";
type Task = {
  name: string;
  category: string;
  created: string;
  status: "Completed" | "In progress" | "Needs review";
};

const adminStats = [
  ["Total Users", "248", "Across this sample workspace"],
  ["Active Projects", "18", "Static demonstration data"],
  ["Demo Requests", "36", "Static demonstration data"],
  ["Monthly Revenue", "₹1,25,000", "Illustrative sample only"],
];

const demoStats = [
  ["Total Projects", "12", "Sample workspace"],
  ["Active Workflows", "8", "No workflows are running"],
  ["AI Tasks Completed", "1,284", "Illustrative sample count"],
  ["Pending Tasks", "17", "Sample tasks for this demo"],
];

const tasks: Task[] = [
  {
    name: "Review supplier documents",
    category: "Knowledge",
    created: "18 Oct 2026",
    status: "Needs review",
  },
  {
    name: "Prepare weekly project summary",
    category: "Reporting",
    created: "17 Oct 2026",
    status: "Completed",
  },
  {
    name: "Classify support enquiries",
    category: "Operations",
    created: "16 Oct 2026",
    status: "In progress",
  },
  {
    name: "Draft meeting follow-up",
    category: "Productivity",
    created: "15 Oct 2026",
    status: "Completed",
  },
  {
    name: "Check policy references",
    category: "Knowledge",
    created: "14 Oct 2026",
    status: "Needs review",
  },
];

const activityRows = [
  ["New workspace created", "Aarav Mehta", "18 Oct 2026", "Complete"],
  ["Demo request received", "Mira Shah", "17 Oct 2026", "New"],
  ["Project status updated", "Dev Patel", "16 Oct 2026", "Complete"],
  ["Report viewed", "Anaya Rao", "15 Oct 2026", "Complete"],
];

const requestRows = [
  ["Mira Shah", "mira@example.test", "AI & automation", "17 Oct 2026", "New"],
  [
    "Dev Patel",
    "dev@example.test",
    "Software engineering",
    "16 Oct 2026",
    "Review",
  ],
  [
    "Anaya Rao",
    "anaya@example.test",
    "Technology consulting",
    "14 Oct 2026",
    "Contacted",
  ],
];

const adminNavigation = [
  ["Dashboard", LayoutDashboard],
  ["Users", Users],
  ["Projects", BriefcaseBusiness],
  ["Demo Requests", CircleHelp],
  ["Reports", Activity],
  ["Settings", ShieldCheck],
] as const;

const demoNavigation = [
  ["Dashboard", LayoutDashboard],
  ["Projects", BriefcaseBusiness],
  ["Workflows", Workflow],
  ["Tasks", Check],
] as const;

function PortalNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="portal-notice" role="note">
      <ShieldCheck size={17} aria-hidden="true" />
      {children}
    </div>
  );
}

export function PortalLogin({ portal }: { portal: PortalKind }) {
  const isAdmin = portal === "admin";
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function enter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setLoading(true);
    const formData = new FormData(form);
    try {
      const response = await fetch("/api/portal-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          portal,
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });
      const result: unknown = await response.json();
      if (!response.ok) {
        const message =
          typeof result === "object" &&
          result !== null &&
          "error" in result &&
          typeof result.error === "string"
            ? result.error
            : "Unable to sign in. Please try again.";
        setError(message);
        return;
      }
      router.push(`/${portal}/dashboard`);
    } catch {
      setError("Unable to contact the sign-in service. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={`portal-login-page ${isAdmin ? "admin-theme" : "demo-theme"}`}
    >
      <section
        className="portal-login-card"
        aria-labelledby="portal-login-title"
      >
        <Link className="portal-brand" href="/" aria-label="PraedicoAI home">
          <span className="portal-brand-mark">
            P<span>.</span>
          </span>
          <span>PraedicoAI</span>
        </Link>
        <p className="portal-eyebrow">
          {isAdmin ? "Workspace administration" : "Interactive preview"}
        </p>
        <h1 id="portal-login-title">
          {isAdmin ? "Admin Portal" : "PraedicoAI Demo Portal"}
        </h1>
        <p className="portal-subtitle">
          {isAdmin
            ? "Sign in to manage your workspace."
            : "Sign in with your demo access details to explore the platform."}
        </p>
        <PortalNotice>
          {isAdmin
            ? "Admin prototype — credentials are checked server-side; the workspace uses static sample data."
            : "Demo Environment — Sample Data Only"}
        </PortalNotice>
        <form className="portal-login-form" onSubmit={enter}>
          <label htmlFor={`${portal}-email`}>Email</label>
          <input
            id={`${portal}-email`}
            name="email"
            type="email"
            autoComplete="username"
            placeholder="you@company.com"
            required
          />
          <label htmlFor={`${portal}-password`}>Password</label>
          <div className="portal-password">
            <input
              id={`${portal}-password`}
              name="password"
              type={passwordVisible ? "text" : "password"}
              autoComplete={isAdmin ? "current-password" : "off"}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              className="portal-password-toggle"
              aria-label={passwordVisible ? "Hide password" : "Show password"}
              aria-pressed={passwordVisible}
              onClick={() => setPasswordVisible((visible) => !visible)}
            >
              {passwordVisible ? "Hide" : "Show"}
            </button>
          </div>
          {error && (
            <p className="portal-form-error" role="alert">
              {error}
            </p>
          )}
          <button className="portal-button" type="submit" disabled={loading}>
            {loading ? "Signing in..." : isAdmin ? "Sign in" : "Sign in"}
            <ChevronRight size={17} aria-hidden="true" />
          </button>
        </form>
        <Link className="portal-back-link" href="/">
          Return to the main website
        </Link>
        <p className="portal-login-footnote">
          {isAdmin
            ? "The portal is a static prototype, not a production administration system."
            : "Demo access is separate from Admin. All content is sample data."}
        </p>
      </section>
    </div>
  );
}

function PortalGuard({
  portal,
  children,
}: {
  portal: PortalKind;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [verificationError, setVerificationError] = useState("");

  useEffect(() => {
    let active = true;
    fetch(`/api/portal-auth/session?portal=${portal}`, {
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Session verification failed.");
        const result: unknown = await response.json();
        return (
          typeof result === "object" &&
          result !== null &&
          "authenticated" in result &&
          result.authenticated === true
        );
      })
      .then((allowed) => {
        if (!active) return;
        if (allowed) {
          setAuthorized(true);
          setChecking(false);
        } else {
          router.replace(`/${portal}/login`);
        }
      })
      .catch(() => {
        if (!active) return;
        setChecking(false);
        setVerificationError(
          "We couldn't verify this portal session. Refresh the page or sign in again.",
        );
      });
    return () => {
      active = false;
    };
  }, [portal, router]);

  if (checking || !authorized) {
    if (verificationError) {
      return (
        <div className="portal-loading" role="alert">
          {verificationError}
        </div>
      );
    }
    return (
      <div className="portal-loading" role="status">
        Checking this browser session…
      </div>
    );
  }
  return children;
}

function MiniChart({
  title,
  values,
  labels,
  color = "teal",
}: {
  title: string;
  values: number[];
  labels: string[];
  color?: "teal" | "indigo";
}) {
  const max = Math.max(...values);
  return (
    <section className="portal-panel portal-chart">
      <div className="portal-panel-heading">
        <div>
          <h2>{title}</h2>
          <p>Sample data · last 6 months</p>
        </div>
        <span className="portal-chart-key">
          <i className={color} /> Sample
        </span>
      </div>
      <div
        className="portal-chart-bars"
        role="img"
        aria-label={`${title}, sample data`}
      >
        {values.map((value, index) => (
          <div
            className="portal-chart-column"
            key={`${labels[index]}-${value}`}
          >
            <span className="portal-chart-value">{value}</span>
            <div
              className={`portal-chart-bar ${color}`}
              style={{ height: `${Math.max(12, (value / max) * 100)}%` }}
            />
            <span className="portal-chart-label">{labels[index]}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatCards({ stats }: { stats: string[][] }) {
  return (
    <div className="portal-stat-grid">
      {stats.map(([label, value, note], index) => (
        <article className="portal-stat-card" key={label}>
          <span className={`portal-stat-icon icon-${index}`} aria-hidden="true">
            {index === 0 ? (
              <Users size={18} />
            ) : index === 1 ? (
              <BriefcaseBusiness size={18} />
            ) : index === 2 ? (
              <Activity size={18} />
            ) : (
              <Workflow size={18} />
            )}
          </span>
          <p>{label}</p>
          <strong>{value}</strong>
          <small>{note}</small>
        </article>
      ))}
    </div>
  );
}

function SimpleTable({
  title,
  columns,
  rows,
}: {
  title: string;
  columns: string[];
  rows: string[][];
}) {
  return (
    <section className="portal-panel portal-table-panel">
      <div className="portal-panel-heading">
        <div>
          <h2>{title}</h2>
          <p>Illustrative records only</p>
        </div>
      </div>
      <div className="portal-table-scroll">
        <table className="portal-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.join("-")}>
                {row.map((cell, index) => (
                  <td key={`${index}-${cell}`}>
                    {index === row.length - 1 ? (
                      <span
                        className={`portal-status status-${cell.toLowerCase().replaceAll(" ", "-")}`}
                      >
                        {cell}
                      </span>
                    ) : (
                      cell
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TaskTable() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [sortAscending, setSortAscending] = useState(true);
  const [selected, setSelected] = useState<Task | null>(null);
  const statuses = ["All statuses", "Completed", "In progress", "Needs review"];
  const filteredTasks = useMemo(
    () =>
      tasks
        .filter((task) => status === "All statuses" || task.status === status)
        .filter((task) =>
          `${task.name} ${task.category}`
            .toLowerCase()
            .includes(search.toLowerCase()),
        )
        .sort((a, b) =>
          sortAscending
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name),
        ),
    [search, sortAscending, status],
  );

  return (
    <section className="portal-panel portal-table-panel">
      <div className="portal-panel-heading task-heading">
        <div>
          <h2>Sample tasks</h2>
          <p>Search, filter, sort, and inspect the local sample records.</p>
        </div>
        <div className="portal-table-controls">
          <label className="portal-search">
            <Search size={16} aria-hidden="true" />
            <span className="visually-hidden">Search tasks</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tasks"
            />
          </label>
          <label className="visually-hidden" htmlFor="task-status">
            Filter by status
          </label>
          <select
            id="task-status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            {statuses.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="portal-table-scroll">
        <table className="portal-table">
          <thead>
            <tr>
              <th>
                <button
                  className="portal-sort"
                  onClick={() => setSortAscending((value) => !value)}
                >
                  Task Name{" "}
                  {sortAscending ? (
                    <ArrowUp size={14} />
                  ) : (
                    <ArrowDown size={14} />
                  )}
                </button>
              </th>
              <th>Category</th>
              <th>Created Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length ? (
              filteredTasks.map((task) => (
                <tr key={task.name}>
                  <td>{task.name}</td>
                  <td>{task.category}</td>
                  <td>{task.created}</td>
                  <td>
                    <span
                      className={`portal-status status-${task.status.toLowerCase().replaceAll(" ", "-")}`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="portal-detail-button"
                      onClick={() => setSelected(task)}
                    >
                      View details
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="portal-empty">
                  No sample tasks match these filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {selected && (
        <div
          className="portal-modal-backdrop"
          onClick={() => setSelected(null)}
        >
          <section
            className="portal-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="portal-modal-close"
              aria-label="Close task details"
              onClick={() => setSelected(null)}
            >
              <X size={19} />
            </button>
            <span className="portal-eyebrow">Sample task details</span>
            <h2 id="task-dialog-title">{selected.name}</h2>
            <dl>
              <div>
                <dt>Category</dt>
                <dd>{selected.category}</dd>
              </div>
              <div>
                <dt>Created</dt>
                <dd>{selected.created}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{selected.status}</dd>
              </div>
            </dl>
            <p>
              This is a static illustration. No AI task is running and no
              external action will be taken.
            </p>
          </section>
        </div>
      )}
    </section>
  );
}

function PlaceholderSection({
  title,
  portal,
}: {
  title: string;
  portal: PortalKind;
}) {
  return (
    <section className="portal-panel portal-placeholder">
      <span className="portal-placeholder-icon">
        <CircleHelp size={24} />
      </span>
      <h2>{title}</h2>
      <p>
        {portal === "admin"
          ? "This section is a prototype placeholder. No real workspace records or administrative actions are connected."
          : "This section is part of the sample environment. It does not connect to live projects, workflows, or AI services."}
      </p>
      <span className="portal-status status-review">Demonstration only</span>
    </section>
  );
}

function PortalFrame({ portal }: { portal: PortalKind }) {
  const isAdmin = portal === "admin";
  const router = useRouter();
  const [section, setSection] = useState("Dashboard");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [noticeVisible, setNoticeVisible] = useState(true);
  const [notificationVisible, setNotificationVisible] = useState(true);
  const [logoutError, setLogoutError] = useState("");
  const nav = isAdmin ? adminNavigation : demoNavigation;

  async function logout() {
    setLogoutError("");
    try {
      const response = await fetch("/api/portal-auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portal }),
      });
      if (!response.ok) throw new Error("Logout request failed.");
      router.replace(`/${portal}/login`);
    } catch {
      setLogoutError("Unable to end this session. Please try again.");
    }
  }

  return (
    <PortalGuard portal={portal}>
      <div className={`portal-app ${isAdmin ? "admin-theme" : "demo-theme"}`}>
        <aside className={`portal-sidebar ${mobileNavOpen ? "is-open" : ""}`}>
          <Link href="/" className="portal-sidebar-brand">
            <span className="portal-brand-mark">
              P<span>.</span>
            </span>
            <span>
              PraedicoAI
              <small>{isAdmin ? "ADMIN WORKSPACE" : "DEMO WORKSPACE"}</small>
            </span>
          </Link>
          <div className="portal-sidebar-caption">
            {isAdmin ? "Workspace" : "Sample environment"}
          </div>
          <nav aria-label={`${isAdmin ? "Admin" : "Demo"} portal navigation`}>
            {nav.map(([label, Icon]) => (
              <button
                key={label}
                className={section === label ? "is-active" : ""}
                onClick={() => {
                  setSection(label);
                  setMobileNavOpen(false);
                }}
              >
                <Icon size={18} aria-hidden="true" />
                {label}
              </button>
            ))}
          </nav>
          <div className="portal-sidebar-bottom">
            <PortalNotice>
              {isAdmin ? "Static prototype" : "Sample data only"}
            </PortalNotice>
            {logoutError && (
              <p className="portal-form-error" role="alert">
                {logoutError}
              </p>
            )}
            <button className="portal-logout" onClick={logout}>
              <LogOut size={17} />
              Log out
            </button>
            <Link href="/" className="portal-return">
              Return to main website <ArrowUp size={14} />
            </Link>
          </div>
        </aside>
        <div className="portal-content">
          <header className="portal-topbar">
            <button
              className="portal-mobile-menu"
              onClick={() => setMobileNavOpen((open) => !open)}
              aria-label={
                mobileNavOpen
                  ? "Close portal navigation"
                  : "Open portal navigation"
              }
            >
              {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="portal-breadcrumb">
              <span>{isAdmin ? "Admin" : "Demo"}</span>
              <ChevronRight size={14} />
              <strong>{section}</strong>
            </div>
            <div className="portal-user">
              <span className="portal-avatar">{isAdmin ? "AD" : "DM"}</span>
              <span>
                {isAdmin ? "Prototype Admin" : "Demo Visitor"}
                <small>
                  {isAdmin ? "Admin prototype" : "Sample workspace"}
                </small>
              </span>
            </div>
          </header>
          <div className="portal-main">
            <div className="portal-page-title">
              <div>
                <p className="portal-eyebrow">
                  {isAdmin
                    ? "Admin workspace · static sample"
                    : "PraedicoAI · sample environment"}
                </p>
                <h1>{section}</h1>
                <p>
                  {isAdmin
                    ? "Illustrative overview for the administration experience."
                    : "Explore a concept dashboard using local, fictional sample data."}
                </p>
              </div>
              <span className="portal-env-badge">
                <i />
                {isAdmin ? "PROTOTYPE" : "DEMO"}
              </span>
            </div>
            {!isAdmin && noticeVisible && (
              <div className="portal-dismiss-notice">
                <PortalNotice>
                  Demo Environment — Sample Data Only. AI workflows shown here
                  are not running.
                </PortalNotice>
                <button
                  aria-label="Dismiss sample data notice"
                  onClick={() => setNoticeVisible(false)}
                >
                  <X size={17} />
                </button>
              </div>
            )}
            {section !== "Dashboard" ? (
              <PlaceholderSection title={section} portal={portal} />
            ) : isAdmin ? (
              <>
                <StatCards stats={adminStats} />
                <div className="portal-charts-grid">
                  <MiniChart
                    title="Monthly user registrations"
                    values={[18, 27, 22, 34, 31, 42]}
                    labels={["May", "Jun", "Jul", "Aug", "Sep", "Oct"]}
                  />
                  <MiniChart
                    title="Project status distribution"
                    values={[18, 12, 7, 3]}
                    labels={["Active", "Review", "Planned", "Paused"]}
                    color="indigo"
                  />
                  <MiniChart
                    title="Monthly demo requests"
                    values={[9, 14, 12, 20, 18, 26]}
                    labels={["May", "Jun", "Jul", "Aug", "Sep", "Oct"]}
                    color="indigo"
                  />
                </div>
                <SimpleTable
                  title="Recent activity"
                  columns={["Activity", "User", "Date", "Status"]}
                  rows={activityRows}
                />
                <SimpleTable
                  title="Recent demo requests"
                  columns={[
                    "Name",
                    "Email",
                    "Requested Service",
                    "Date",
                    "Status",
                  ]}
                  rows={requestRows}
                />
              </>
            ) : (
              <>
                <StatCards stats={demoStats} />
                <div className="portal-demo-grid">
                  <MiniChart
                    title="Sample performance"
                    values={[34, 47, 42, 63, 55, 76]}
                    labels={["May", "Jun", "Jul", "Aug", "Sep", "Oct"]}
                  />
                  <section className="portal-panel portal-workflow-panel">
                    <div className="portal-panel-heading">
                      <div>
                        <h2>Project overview</h2>
                        <p>Sample project statuses</p>
                      </div>
                      <BriefcaseBusiness size={19} />
                    </div>
                    {[
                      ["Knowledge assistant concept", "In progress", 68],
                      ["Operations workflow map", "Review", 42],
                      ["Support triage prototype", "Planned", 24],
                    ].map(([name, state, amount]) => (
                      <div className="portal-project-row" key={name as string}>
                        <div>
                          <strong>{name}</strong>
                          <span
                            className={`portal-status status-${(state as string).toLowerCase()}`}
                          >
                            {state}
                          </span>
                        </div>
                        <div className="portal-progress">
                          <span style={{ width: `${amount}%` }} />
                        </div>
                        <small>{amount}% sample progress</small>
                      </div>
                    ))}
                  </section>
                </div>
                <div className="portal-demo-grid">
                  <section className="portal-panel portal-workflow-panel">
                    <div className="portal-panel-heading">
                      <div>
                        <h2>Workflow activity</h2>
                        <p>Illustrative activity, not live automation</p>
                      </div>
                      <Workflow size={19} />
                    </div>
                    {[
                      ["Document review", "Last sample update · 2 hours ago"],
                      [
                        "Enquiry classification",
                        "Last sample update · Yesterday",
                      ],
                      ["Weekly summary", "Last sample update · 2 days ago"],
                    ].map(([name, sub]) => (
                      <div className="portal-activity-item" key={name}>
                        <span className="portal-activity-dot" />
                        <div>
                          <strong>{name}</strong>
                          <small>{sub}</small>
                        </div>
                        <span className="portal-status status-in-progress">
                          Sample
                        </span>
                      </div>
                    ))}
                  </section>
                  <section className="portal-panel portal-workflow-panel">
                    <div className="portal-panel-heading">
                      <div>
                        <h2>Recent notifications</h2>
                        <p>Local sample notifications</p>
                      </div>
                      <Bell size={18} />
                    </div>
                    {notificationVisible ? (
                      <div className="portal-activity-item">
                        <span className="portal-activity-dot" />
                        <div>
                          <strong>Sample task needs review</strong>
                          <small>
                            Supplier document review · Just now (sample)
                          </small>
                        </div>
                        <button
                          className="portal-dismiss-notification"
                          aria-label="Dismiss sample notification"
                          onClick={() => setNotificationVisible(false)}
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ) : (
                      <p className="portal-empty">No sample notifications.</p>
                    )}
                  </section>
                </div>
                <section className="portal-panel portal-usage-panel">
                  <div className="portal-panel-heading">
                    <div>
                      <h2>AI automation usage</h2>
                      <p>
                        Illustrative task distribution · no live AI services
                        connected
                      </p>
                    </div>
                    <Activity size={19} />
                  </div>
                  {[
                    ["Knowledge retrieval", 76],
                    ["Document summarization", 58],
                    ["Enquiry classification", 43],
                    ["Draft preparation", 31],
                  ].map(([label, percentage]) => (
                    <div className="portal-usage-row" key={label as string}>
                      <div>
                        <span>{label}</span>
                        <strong>{percentage}%</strong>
                      </div>
                      <div className="portal-progress">
                        <span style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </section>
                <TaskTable />
              </>
            )}
            <p className="portal-footer-note">
              {isAdmin
                ? "Static administrative demonstration. No backend, real user records, or production access controls are connected."
                : "Demonstration content only. No real AI tasks, workflows, customer records, or project updates are being processed."}
            </p>
          </div>
        </div>
      </div>
    </PortalGuard>
  );
}

export function PortalDashboard({ portal }: { portal: PortalKind }) {
  return <PortalFrame portal={portal} />;
}
