"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Activity,
  BarChart3,
  BriefcaseBusiness,
  FileText,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";

type Employee = {
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  department: string;
  jobTitle: string;
  workStatus: "active" | "on_leave" | "inactive";
  manager?: { name: string; email: string } | null;
};
type Project = {
  id: string;
  name: string;
  description: string;
  status: "planned" | "in_progress" | "on_hold" | "completed";
  startDate?: string | null;
  endDate?: string | null;
  owner: { id: string; name: string; email: string } | null;
  members: Array<{ id: string; name: string; email: string }>;
};
type EmployeeReport = {
  departments: Array<{ _id: string; employees: number; active: number }>;
  projects: Array<{ _id: string; count: number }>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getErrorMessage(value: unknown) {
  return isRecord(value) &&
    isRecord(value.error) &&
    typeof value.error.message === "string"
    ? value.error.message
    : isRecord(value) && typeof value.error === "string"
      ? value.error
      : "The request could not be completed. Please try again.";
}

async function responseJson(response: Response) {
  const result: unknown = await response.json();
  if (!response.ok) throw new Error(getErrorMessage(result));
  return result;
}

export function AdminSidebar({
  permissions,
  current,
}: {
  permissions: string[];
  current: "employees" | "projects" | "reports";
}) {
  const router = useRouter();

  async function signOut() {
    await fetch("/api/portal-auth/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  return (
    <aside className="portal-sidebar">
      <Link className="portal-sidebar-brand" href="/admin/dashboard">
        <span className="portal-brand-mark">
          P<span>.</span>
        </span>
        <span>
          PraedicoAI<small>TEAM WORKSPACE</small>
        </span>
      </Link>
      <p className="portal-sidebar-caption">Workforce</p>
      <nav aria-label="Workspace navigation">
        {(permissions.includes("content:read") ||
          permissions.includes("content:manage")) && (
          <Link className="lead-admin-nav" href="/admin/content">
            <FileText size={17} aria-hidden="true" /> Content
          </Link>
        )}
        {permissions.includes("reports:read") && (
          <Link
            className={`lead-admin-nav${current === "reports" ? " is-active" : ""}`}
            href="/admin/reports"
          >
            <BarChart3 size={17} aria-hidden="true" /> Overview
          </Link>
        )}
        {(permissions.includes("employees:read") ||
          permissions.includes("employees:manage")) && (
          <Link
            className={`lead-admin-nav${current === "employees" ? " is-active" : ""}`}
            href="/admin/employees"
          >
            <Users size={17} aria-hidden="true" /> Employees
          </Link>
        )}
        {permissions.includes("employees:self:read") && (
          <Link className="lead-admin-nav" href="/admin/employees/me">
            <ShieldCheck size={17} aria-hidden="true" /> My profile
          </Link>
        )}
        {(permissions.includes("projects:read") ||
          permissions.includes("projects:manage") ||
          permissions.includes("projects:self:read")) && (
          <Link
            className={`lead-admin-nav${current === "projects" ? " is-active" : ""}`}
            href="/admin/projects"
          >
            <BriefcaseBusiness size={17} aria-hidden="true" /> Projects
          </Link>
        )}
      </nav>
      <div className="portal-sidebar-bottom">
        <div className="portal-notice">
          <ShieldCheck size={17} aria-hidden="true" />
          Access is role-scoped
        </div>
        <button className="portal-return" type="button" onClick={signOut}>
          <LogOut size={15} aria-hidden="true" /> Sign out
        </button>
      </div>
    </aside>
  );
}

export function EmployeeDirectoryDashboard({
  permissions,
}: {
  permissions: string[];
}) {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [department, setDepartment] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [workStatus, setWorkStatus] =
    useState<Employee["workStatus"]>("active");
  const [report, setReport] = useState<EmployeeReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const refresh = useCallback(async () => {
    const response = await fetch("/api/admin/employees", { cache: "no-store" });
    if (response.status === 401) {
      router.replace("/admin/login");
      throw new Error("Your session has expired.");
    }
    const result = await responseJson(response);
    if (
      !isRecord(result) ||
      !isRecord(result.data) ||
      !Array.isArray(result.data.employees)
    ) {
      throw new Error("The employee service returned invalid data.");
    }
    const rows = result.data.employees as Employee[];
    setEmployees(rows);
    const selected = rows.find((item) => item.id === selectedId) ?? rows[0];
    setSelectedId(selected?.id ?? "");
    setDepartment(selected?.department ?? "");
    setJobTitle(selected?.jobTitle ?? "");
    setWorkStatus(selected?.workStatus ?? "active");
    if (permissions.includes("reports:read")) {
      const reportResponse = await fetch("/api/admin/employees/reports", {
        cache: "no-store",
      });
      const reportResult = await responseJson(reportResponse);
      if (
        isRecord(reportResult) &&
        isRecord(reportResult.data) &&
        Array.isArray(reportResult.data.departments) &&
        Array.isArray(reportResult.data.projects)
      ) {
        setReport(reportResult.data as EmployeeReport);
      }
    }
  }, [permissions, router, selectedId]);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const response = await fetch("/api/admin/employees", {
          cache: "no-store",
        });
        if (response.status === 401) {
          router.replace("/admin/login");
          throw new Error("Your session has expired.");
        }
        const result = await responseJson(response);
        if (
          !isRecord(result) ||
          !isRecord(result.data) ||
          !Array.isArray(result.data.employees)
        ) {
          throw new Error("The employee service returned invalid data.");
        }
        const rows = result.data.employees as Employee[];
        const selected = rows.find((item) => item.id === selectedId) ?? rows[0];
        if (!active) return;
        setEmployees(rows);
        setSelectedId(selected?.id ?? "");
        setDepartment(selected?.department ?? "");
        setJobTitle(selected?.jobTitle ?? "");
        setWorkStatus(selected?.workStatus ?? "active");
        if (permissions.includes("reports:read")) {
          const reportResponse = await fetch("/api/admin/employees/reports", {
            cache: "no-store",
          });
          const reportResult = await responseJson(reportResponse);
          if (
            active &&
            isRecord(reportResult) &&
            isRecord(reportResult.data) &&
            Array.isArray(reportResult.data.departments) &&
            Array.isArray(reportResult.data.projects)
          ) {
            setReport(reportResult.data as EmployeeReport);
          }
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Employees could not be loaded.",
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
  }, [permissions, router, selectedId]);

  function chooseEmployee(id: string) {
    const selected = employees.find((employee) => employee.id === id);
    if (!selected) return;
    setSelectedId(id);
    setDepartment(selected.department);
    setJobTitle(selected.jobTitle);
    setWorkStatus(selected.workStatus);
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/employees/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedId,
          department,
          jobTitle,
          workStatus,
        }),
      });
      await responseJson(response);
      setNotice("Employee work profile saved.");
      await refresh();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "The profile could not be saved.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="portal-app lead-admin-app workforce-app">
      <AdminSidebar permissions={permissions} current="employees" />
      <main className="portal-content">
        <header className="portal-topbar">
          <div className="portal-breadcrumb">
            <Users size={16} aria-hidden="true" />
            <span>Workforce</span>
            <span>/</span>
            <strong>Employees</strong>
          </div>
          <button
            className="lead-admin-refresh"
            type="button"
            onClick={() => void refresh()}
          >
            <RefreshCw size={15} aria-hidden="true" /> Refresh
          </button>
        </header>
        <div className="portal-page-content">
          <section className="lead-admin-panel">
            <div className="lead-admin-panel-heading">
              <div>
                <span className="portal-eyebrow">People operations</span>
                <h1>Employee directory</h1>
              </div>
              <span>{employees.length} accounts</span>
            </div>
            <p className="portal-footer-note">
              Work contact and assignment details only. Personal and sensitive
              employee records are not stored here.
            </p>
            {report && (
              <div className="portal-stat-grid workforce-report-grid">
                <article className="portal-stat-card">
                  <Users size={18} aria-hidden="true" />
                  <p>Active employees</p>
                  <strong>
                    {report.departments.reduce(
                      (sum, item) => sum + item.active,
                      0,
                    )}
                  </strong>
                  <small>Across {report.departments.length} departments</small>
                </article>
                <article className="portal-stat-card">
                  <BriefcaseBusiness size={18} aria-hidden="true" />
                  <p>Tracked projects</p>
                  <strong>
                    {report.projects.reduce((sum, item) => sum + item.count, 0)}
                  </strong>
                  <small>Grouped by status</small>
                </article>
              </div>
            )}
            {error && (
              <p className="lead-admin-error" role="alert">
                {error}
              </p>
            )}
            {notice && (
              <p className="lead-admin-notice" role="status">
                {notice}
              </p>
            )}
            {loading ? (
              <p>Loading employees…</p>
            ) : employees.length === 0 ? (
              <p>
                No employee accounts are available yet. Assign an existing
                account the Employee role first.
              </p>
            ) : (
              <>
                <div className="lead-admin-table-wrap">
                  <table className="lead-admin-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Work email</th>
                        <th>Department</th>
                        <th>Job title</th>
                        <th>Manager</th>
                        <th>Work status</th>
                        <th>Account</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((employee) => (
                        <tr
                          key={employee.id}
                          className={
                            selectedId === employee.id ? "is-selected" : ""
                          }
                          tabIndex={0}
                          aria-selected={selectedId === employee.id}
                          onClick={() => chooseEmployee(employee.id)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              chooseEmployee(employee.id);
                            }
                          }}
                        >
                          <td>{employee.fullName}</td>
                          <td>{employee.email}</td>
                          <td>{employee.department || "—"}</td>
                          <td>{employee.jobTitle || "—"}</td>
                          <td>{employee.manager?.name ?? "—"}</td>
                          <td>{employee.workStatus.replace("_", " ")}</td>
                          <td>
                            {employee.isActive
                              ? "Account active"
                              : "Account inactive"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {permissions.includes("employees:manage") && (
                  <form className="lead-admin-editor" onSubmit={saveProfile}>
                    <label>
                      Employee
                      <select
                        value={selectedId}
                        onChange={(event) => chooseEmployee(event.target.value)}
                      >
                        {employees.map((employee) => (
                          <option value={employee.id} key={employee.id}>
                            {employee.fullName} · {employee.email}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Department
                      <input
                        value={department}
                        maxLength={100}
                        required
                        onChange={(event) => setDepartment(event.target.value)}
                      />
                    </label>
                    <label>
                      Job title
                      <input
                        value={jobTitle}
                        maxLength={100}
                        required
                        onChange={(event) => setJobTitle(event.target.value)}
                      />
                    </label>
                    <label>
                      Work status
                      <select
                        value={workStatus}
                        onChange={(event) =>
                          setWorkStatus(
                            event.target.value as Employee["workStatus"],
                          )
                        }
                      >
                        <option value="active">Active</option>
                        <option value="on_leave">On leave</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </label>
                    <button
                      className="button button-primary"
                      type="submit"
                      disabled={saving || !selectedId}
                    >
                      {saving ? "Saving…" : "Save work profile"}
                    </button>
                  </form>
                )}
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export function EmployeeSelfDashboard({
  permissions,
}: {
  permissions: string[];
}) {
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    void fetch("/api/admin/employees/me", { cache: "no-store" })
      .then(async (response) => {
        if (response.status === 401) {
          router.replace("/admin/login");
          throw new Error("Your session has expired.");
        }
        const result = await responseJson(response);
        if (
          !isRecord(result) ||
          !isRecord(result.data) ||
          !isRecord(result.data.employee)
        ) {
          throw new Error("The employee service returned invalid data.");
        }
        setEmployee(result.data.employee as Employee);
      })
      .catch((loadError: unknown) =>
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Profile could not be loaded.",
        ),
      );
  }, [router]);

  return (
    <div className="portal-app lead-admin-app workforce-app">
      <AdminSidebar permissions={permissions} current="employees" />
      <main className="portal-content">
        <header className="portal-topbar">
          <div className="portal-breadcrumb">
            <Users size={16} aria-hidden="true" />
            <span>Workforce</span>
            <span>/</span>
            <strong>My profile</strong>
          </div>
        </header>
        <div className="portal-page-content">
          <section className="lead-admin-panel">
            <span className="portal-eyebrow">Employee workspace</span>
            <h1>My work profile</h1>
            {error && (
              <p className="lead-admin-error" role="alert">
                {error}
              </p>
            )}
            {!employee && !error ? (
              <p>Loading your profile…</p>
            ) : (
              employee && (
                <dl className="portal-profile-details">
                  <div>
                    <dt>Name</dt>
                    <dd>{employee.fullName}</dd>
                  </div>
                  <div>
                    <dt>Work email</dt>
                    <dd>{employee.email}</dd>
                  </div>
                  <div>
                    <dt>Department</dt>
                    <dd>{employee.department || "Not assigned"}</dd>
                  </div>
                  <div>
                    <dt>Job title</dt>
                    <dd>{employee.jobTitle || "Not assigned"}</dd>
                  </div>
                  <div>
                    <dt>Work status</dt>
                    <dd>{employee.workStatus.replace("_", " ")}</dd>
                  </div>
                </dl>
              )
            )}
            <p className="portal-footer-note">
              This profile is read-only. Ask an authorized manager to update
              work details.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

export function ProjectDashboard({ permissions }: { permissions: string[] }) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  const refresh = useCallback(async () => {
    const response = await fetch("/api/admin/projects", { cache: "no-store" });
    if (response.status === 401) {
      router.replace("/admin/login");
      throw new Error("Your session has expired.");
    }
    const result = await responseJson(response);
    if (
      !isRecord(result) ||
      !isRecord(result.data) ||
      !Array.isArray(result.data.projects)
    ) {
      throw new Error("The project service returned invalid data.");
    }
    setProjects(result.data.projects as Project[]);
  }, [router]);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const projectsResponse = await fetch("/api/admin/projects", {
          cache: "no-store",
        });
        if (projectsResponse.status === 401) {
          router.replace("/admin/login");
          throw new Error("Your session has expired.");
        }
        const projectsResult = await responseJson(projectsResponse);
        if (
          !isRecord(projectsResult) ||
          !isRecord(projectsResult.data) ||
          !Array.isArray(projectsResult.data.projects)
        ) {
          throw new Error("The project service returned invalid data.");
        }
        if (active) setProjects(projectsResult.data.projects as Project[]);
        if (permissions.includes("employees:read")) {
          const employeesResponse = await fetch("/api/admin/employees", {
            cache: "no-store",
          });
          const employeesResult = await responseJson(employeesResponse);
          if (
            active &&
            isRecord(employeesResult) &&
            isRecord(employeesResult.data) &&
            Array.isArray(employeesResult.data.employees)
          ) {
            const rows = (employeesResult.data.employees as Employee[]).filter(
              (item) => item.isActive,
            );
            setEmployees(rows);
          }
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Projects could not be loaded.",
          );
        }
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [permissions, router]);

  async function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          memberIds,
          status: "planned",
        }),
      });
      await responseJson(response);
      setName("");
      setDescription("");
      setMemberIds([]);
      setNotice("Project created.");
      await refresh();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "The project could not be created.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function changeMembers(project: Project, selectedIds: string[]) {
    setError("");
    try {
      const response = await fetch(`/api/admin/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberIds: selectedIds }),
      });
      await responseJson(response);
      await refresh();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Project assignments could not be changed.",
      );
    }
  }

  async function changeStatus(project: Project, status: Project["status"]) {
    setError("");
    try {
      const response = await fetch(`/api/admin/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await responseJson(response);
      await refresh();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Project status could not be changed.",
      );
    }
  }

  return (
    <div className="portal-app lead-admin-app workforce-app">
      <AdminSidebar permissions={permissions} current="projects" />
      <main className="portal-content">
        <header className="portal-topbar">
          <div className="portal-breadcrumb">
            <BriefcaseBusiness size={16} aria-hidden="true" />
            <span>Workforce</span>
            <span>/</span>
            <strong>Projects</strong>
          </div>
          <button
            className="lead-admin-refresh"
            type="button"
            onClick={() => void refresh()}
          >
            <RefreshCw size={15} aria-hidden="true" /> Refresh
          </button>
        </header>
        <div className="portal-page-content">
          <section className="lead-admin-panel">
            <div className="lead-admin-panel-heading">
              <div>
                <span className="portal-eyebrow">Delivery</span>
                <h1>Project workspace</h1>
              </div>
              <span>{projects.length} projects</span>
            </div>
            {error && (
              <p className="lead-admin-error" role="alert">
                {error}
              </p>
            )}
            {notice && (
              <p className="lead-admin-notice" role="status">
                {notice}
              </p>
            )}
            {permissions.includes("projects:manage") && (
              <form className="lead-admin-editor" onSubmit={create}>
                <label>
                  Project name
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                    maxLength={120}
                  />
                </label>
                <label>
                  Description
                  <input
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    maxLength={1000}
                  />
                </label>
                <label>
                  Team members
                  <select
                    multiple
                    value={memberIds}
                    onChange={(event) =>
                      setMemberIds(
                        Array.from(
                          event.currentTarget.selectedOptions,
                          (option) => option.value,
                        ),
                      )
                    }
                  >
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.fullName}
                      </option>
                    ))}
                  </select>
                </label>
                <p className="portal-footer-note">
                  You will be assigned as the project owner. Select employees to
                  assign to the project.
                </p>
                <button
                  className="button button-primary"
                  type="submit"
                  disabled={saving}
                >
                  {saving ? "Creating…" : "Create project"}
                </button>
              </form>
            )}
            {projects.length === 0 ? (
              <p>No projects are assigned to this workspace yet.</p>
            ) : (
              <div className="workforce-project-list">
                {projects.map((project) => (
                  <article className="workforce-project-card" key={project.id}>
                    <div>
                      <span className="portal-eyebrow">
                        {project.status.replace("_", " ")}
                      </span>
                      <h2>{project.name}</h2>
                      <p>{project.description || "No description provided."}</p>
                    </div>
                    <dl>
                      <div>
                        <dt>Owner</dt>
                        <dd>{project.owner?.name ?? "Unassigned"}</dd>
                      </div>
                      <div>
                        <dt>Team</dt>
                        <dd>
                          {project.members
                            .map((member) => member.name)
                            .join(", ") || "No members assigned"}
                        </dd>
                      </div>
                    </dl>
                    {permissions.includes("projects:manage") && (
                      <label>
                        Project status
                        <select
                          value={project.status}
                          onChange={(event) =>
                            void changeStatus(
                              project,
                              event.target.value as Project["status"],
                            )
                          }
                        >
                          <option value="planned">Planned</option>
                          <option value="in_progress">In progress</option>
                          <option value="on_hold">On hold</option>
                          <option value="completed">Completed</option>
                        </select>
                      </label>
                    )}
                    {permissions.includes("projects:manage") && (
                      <label>
                        Assigned employees
                        <select
                          multiple
                          value={project.members.map((member) => member.id)}
                          onChange={(event) =>
                            void changeMembers(
                              project,
                              Array.from(
                                event.currentTarget.selectedOptions,
                                (option) => option.value,
                              ),
                            )
                          }
                        >
                          {employees.map((employee) => (
                            <option key={employee.id} value={employee.id}>
                              {employee.fullName}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}
                  </article>
                ))}
              </div>
            )}
            {permissions.includes("reports:read") && (
              <p className="portal-footer-note">
                <Activity size={14} aria-hidden="true" /> Workforce reports are
                available to authorized managers.
              </p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
