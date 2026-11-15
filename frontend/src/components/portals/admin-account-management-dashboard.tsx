"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  BriefcaseBusiness,
  Users,
  Check,
  FileText,
  RefreshCw,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useCallback, useEffect, useState, type FormEvent } from "react";

type AdminRole =
  | "member"
  | "staff"
  | "employee"
  | "admin"
  | "hr_manager"
  | "project_manager"
  | "content_manager"
  | "training_manager"
  | "demo_manager";
type Permission =
  | "leads:read"
  | "leads:write"
  | "leads:assign"
  | "leads:export"
  | "demos:read"
  | "demos:manage"
  | "employees:read"
  | "employees:manage"
  | "employees:self:read"
  | "employees:self:write"
  | "projects:read"
  | "projects:manage"
  | "projects:self:read"
  | "content:read"
  | "content:manage"
  | "training:read"
  | "training:manage"
  | "reports:read"
  | "settings:manage"
  | "admins:manage";
type Account = {
  id: string;
  fullName: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  permissions: Permission[];
  customizedPermissions: boolean;
  createdAt: string;
  updatedAt: string;
};
type AccountList = {
  accounts: Account[];
  total: number;
  page: number;
  limit: number;
  roles: AdminRole[];
  permissions: Permission[];
  rolePermissions: Record<AdminRole, Permission[]>;
};
type AccountDraft = {
  role: AdminRole;
  isActive: boolean;
  customizedPermissions: boolean;
  permissions: Permission[];
};

const pageSize = 50;

const roleLabels: Record<AdminRole, string> = {
  member: "Member",
  staff: "Staff",
  employee: "Employee",
  admin: "Admin",
  hr_manager: "HR Manager",
  project_manager: "Project Manager",
  content_manager: "Content Manager",
  training_manager: "Training Manager",
  demo_manager: "Demo Manager",
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
      : "The account change could not be completed.";
}

function isAccount(value: unknown): value is Account {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    typeof value.fullName === "string" &&
    typeof value.email === "string" &&
    typeof value.role === "string" &&
    value.role in roleLabels &&
    typeof value.isActive === "boolean" &&
    Array.isArray(value.permissions) &&
    value.permissions.every((permission) => typeof permission === "string") &&
    typeof value.customizedPermissions === "boolean" &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string"
  );
}

function isAccountList(value: unknown): value is AccountList {
  return (
    isRecord(value) &&
    Array.isArray(value.accounts) &&
    value.accounts.every(isAccount) &&
    typeof value.total === "number" &&
    typeof value.page === "number" &&
    typeof value.limit === "number" &&
    Array.isArray(value.roles) &&
    value.roles.every(
      (role) => typeof role === "string" && role in roleLabels,
    ) &&
    Array.isArray(value.permissions) &&
    value.permissions.every((permission) => typeof permission === "string") &&
    isRecord(value.rolePermissions)
  );
}

function toDraft(account: Account): AccountDraft {
  return {
    role: account.role,
    isActive: account.isActive,
    customizedPermissions: account.customizedPermissions,
    permissions: account.permissions,
  };
}

function hasChanged(account: Account, draft: AccountDraft) {
  return (
    account.role !== draft.role ||
    account.isActive !== draft.isActive ||
    account.customizedPermissions !== draft.customizedPermissions ||
    (draft.customizedPermissions &&
      [...account.permissions].sort().join("|") !==
        [...draft.permissions].sort().join("|"))
  );
}

export function AdminAccountManagementDashboard({
  permissions,
}: {
  permissions: string[];
}) {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [drafts, setDrafts] = useState<Record<string, AccountDraft>>({});
  const [roleOptions, setRoleOptions] = useState<AdminRole[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<
    Permission[]
  >([]);
  const [rolePermissions, setRolePermissions] = useState<
    Record<AdminRole, Permission[]>
  >({} as Record<AdminRole, Permission[]>);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const fetchAccounts = useCallback(async () => {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(pageSize),
    });
    if (search) query.set("search", search);
    const response = await fetch(`/api/admin/accounts?${query}`, {
      cache: "no-store",
    });
    if (response.status === 401) {
      router.replace("/admin/login");
      throw new Error("Your admin session has expired.");
    }
    const result: unknown = await response.json();
    const data =
      isRecord(result) && "data" in result && isAccountList(result.data)
        ? result.data
        : null;
    if (!response.ok) throw new Error(getErrorMessage(result));
    if (!data) throw new Error("The account service returned invalid data.");
    return data;
  }, [page, router, search]);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setSearch(searchInput.trim()),
      250,
    );
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let active = true;
    void fetchAccounts()
      .then((data) => {
        if (!active) return;
        setAccounts(data.accounts);
        setTotal(data.total);
        setRoleOptions(data.roles);
        setAvailablePermissions(data.permissions);
        setRolePermissions(
          data.rolePermissions as Record<AdminRole, Permission[]>,
        );
        setDrafts(
          Object.fromEntries(
            data.accounts.map((account) => [account.id, toDraft(account)]),
          ),
        );
      })
      .catch((loadError: unknown) => {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "The accounts could not be loaded.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [fetchAccounts]);

  function updateDraft(id: string, patch: Partial<AccountDraft>) {
    setDrafts((current) => ({
      ...current,
      [id]: { ...current[id], ...patch },
    }));
  }

  async function saveAccount(account: Account) {
    const draft = drafts[account.id];
    if (!draft || !hasChanged(account, draft)) return;
    setSavingId(account.id);
    setError("");
    setNotice("");
    try {
      const response = await fetch(`/api/admin/accounts/${account.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: draft.role,
          isActive: draft.isActive,
          permissions: draft.customizedPermissions
            ? draft.permissions
            : null,
        }),
      });
      if (response.status === 401) {
        router.replace("/admin/login");
        return;
      }
      const result: unknown = await response.json();
      const updated =
        isRecord(result) &&
        isRecord(result.data) &&
        isAccount(result.data.account)
          ? result.data.account
          : null;
      if (!response.ok) throw new Error(getErrorMessage(result));
      if (!updated) throw new Error("The updated account response was invalid.");
      setAccounts((current) =>
        current.map((item) => (item.id === account.id ? updated : item)),
      );
      setDrafts((current) => ({
        ...current,
        [account.id]: toDraft(updated),
      }));
      setNotice(`Access settings saved for ${updated.email}.`);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "The account change could not be completed.",
      );
    } finally {
      setSavingId("");
    }
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="portal-app lead-admin-app">
      <aside className="portal-sidebar">
        <Link className="portal-sidebar-brand" href="/admin/dashboard">
          <span className="portal-brand-mark">P<span>.</span></span>
          <span>
            PraedicoAI
            <small>SUPER ADMIN</small>
          </span>
        </Link>
        <p className="portal-sidebar-caption">Administration</p>
        <nav aria-label="Admin navigation">
          {permissions.includes("leads:read") && (
            <Link className="lead-admin-nav" href="/admin/dashboard">
              <ArrowLeft size={17} aria-hidden="true" /> Enquiries
            </Link>
          )}
          {permissions.includes("demos:read") && (
            <Link className="lead-admin-nav" href="/admin/demos">
              <ShieldCheck size={17} aria-hidden="true" /> Demo analytics
            </Link>
          )}
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
          <Link className="lead-admin-nav is-active" href="/admin/team">
            <ShieldCheck size={17} aria-hidden="true" /> Admin accounts
          </Link>
        </nav>
        <div className="portal-sidebar-bottom">
          <div className="portal-notice">
            <ShieldCheck size={17} aria-hidden="true" />
            Super Admin only
          </div>
          <Link className="portal-return" href="/">
            Return to website
          </Link>
        </div>
      </aside>
      <div className="portal-content">
        <header className="portal-topbar">
          <div className="portal-breadcrumb">
            <ShieldCheck size={15} aria-hidden="true" />
            <span>Workspace</span>
            <span>/</span>
            <strong>Admin accounts</strong>
          </div>
          <span className="portal-env-badge">
            <i /> SUPER ADMIN
          </span>
        </header>
        <main className="portal-main">
          <div className="portal-page-title lead-admin-title">
            <div>
              <p className="portal-eyebrow">Access control</p>
              <h1>Administrator accounts</h1>
              <p>
                Assign a defined role, activate or deactivate accounts, and
                configure individual permissions. Super Admin access is
                provisioned separately and cannot be changed here.
              </p>
            </div>
            <button
              className="portal-button portal-button-secondary"
              type="button"
              onClick={() => {
                setLoading(true);
                setError("");
                void fetchAccounts()
                  .then((data) => {
                    setAccounts(data.accounts);
                    setTotal(data.total);
                    setRoleOptions(data.roles);
                    setAvailablePermissions(data.permissions);
                    setRolePermissions(
                      data.rolePermissions as Record<
                        AdminRole,
                        Permission[]
                      >,
                    );
                    setDrafts(
                      Object.fromEntries(
                        data.accounts.map((account) => [
                          account.id,
                          toDraft(account),
                        ]),
                      ),
                    );
                  })
                  .catch((refreshError: unknown) => {
                    setError(
                      refreshError instanceof Error
                        ? refreshError.message
                        : "The accounts could not be refreshed.",
                    );
                  })
                  .finally(() => setLoading(false));
              }}
              disabled={loading}
            >
              <RefreshCw size={15} aria-hidden="true" />
              Refresh
            </button>
          </div>
          <form className="admin-account-search" onSubmit={submitSearch}>
            <label htmlFor="admin-account-search">Find an account</label>
            <input
              id="admin-account-search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Name, email, or role"
            />
            <button
              className="portal-button portal-button-secondary"
              type="submit"
            >
              <Search size={15} aria-hidden="true" />
              Search
            </button>
          </form>
          {error && (
            <p className="portal-error" role="alert">
              {error}
            </p>
          )}
          {notice && (
            <p className="portal-success" role="status">
              {notice}
            </p>
          )}
          {loading && <p role="status">Loading accounts...</p>}
          {!loading && !error && !accounts.length && (
            <p className="muted">No matching accounts were found.</p>
          )}
          <section className="admin-account-list" aria-label="User accounts">
            {accounts.map((account) => {
              const draft = drafts[account.id] ?? toDraft(account);
              const changed = hasChanged(account, draft);
              return (
                <article className="portal-panel admin-account-card" key={account.id}>
                  <div className="admin-account-heading">
                    <div>
                      <p className="portal-eyebrow">{account.email}</p>
                      <h2>{account.fullName}</h2>
                    </div>
                    <span
                      className={`lead-status-badge ${draft.isActive ? "status-converted" : "status-closed"}`}
                    >
                      {draft.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="admin-account-controls">
                    <label>
                      Role
                      <select
                        value={draft.role}
                        onChange={(event) => {
                          const role = event.target.value as AdminRole;
                          updateDraft(account.id, {
                            role,
                            ...(draft.customizedPermissions
                              ? {}
                              : {
                                  permissions:
                                    rolePermissions[role] ?? [],
                                }),
                          });
                        }}
                      >
                        {roleOptions.map((role) => (
                          <option key={role} value={role}>
                            {roleLabels[role]}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="admin-account-active">
                      <input
                        type="checkbox"
                        checked={draft.isActive}
                        onChange={(event) =>
                          updateDraft(account.id, {
                            isActive: event.target.checked,
                          })
                        }
                      />
                      Account active
                    </label>
                  </div>
                  <details className="admin-account-permissions">
                    <summary>
                      {draft.customizedPermissions
                        ? "Edit custom permissions"
                        : "Configure individual permissions"}
                    </summary>
                    <p className="muted">
                      {draft.customizedPermissions
                        ? "These permissions override the selected role defaults."
                        : `Current role defaults: ${(rolePermissions[draft.role] ?? []).length} permissions.`}
                    </p>
                    <div className="admin-account-permission-actions">
                      <button
                        className="text-link"
                        type="button"
                        onClick={() =>
                          updateDraft(account.id, {
                            customizedPermissions: true,
                          })
                        }
                      >
                        Customize
                      </button>
                      <button
                        className="text-link"
                        type="button"
                        onClick={() =>
                          updateDraft(account.id, {
                            customizedPermissions: false,
                            permissions:
                              rolePermissions[draft.role] ?? [],
                          })
                        }
                      >
                        Use role defaults
                      </button>
                    </div>
                    {draft.customizedPermissions && (
                      <div className="admin-account-permission-grid">
                        {availablePermissions.map((permission) => (
                          <label key={permission}>
                            <input
                              type="checkbox"
                              checked={draft.permissions.includes(permission)}
                              onChange={(event) => {
                                const nextPermissions = event.target.checked
                                  ? [...draft.permissions, permission]
                                  : draft.permissions.filter(
                                      (item) => item !== permission,
                                    );
                                updateDraft(account.id, {
                                  permissions: nextPermissions,
                                });
                              }}
                            />
                            {permission}
                          </label>
                        ))}
                      </div>
                    )}
                  </details>
                  <div className="admin-account-footer">
                    <span className="muted">
                      {draft.customizedPermissions
                        ? `${draft.permissions.length} custom permissions`
                        : "Role defaults applied"}
                    </span>
                    <button
                      className="portal-button"
                      type="button"
                      disabled={!changed || savingId === account.id}
                      onClick={() => void saveAccount(account)}
                    >
                      <Check size={15} aria-hidden="true" />
                      {savingId === account.id ? "Saving..." : "Save access"}
                    </button>
                  </div>
                </article>
              );
            })}
          </section>
          {pageCount > 1 && (
            <div className="lead-admin-pagination">
              <button
                className="portal-button portal-button-secondary"
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={page === 1 || loading}
              >
                Previous
              </button>
              <span>
                Page {page} of {pageCount}
              </span>
              <button
                className="portal-button portal-button-secondary"
                type="button"
                onClick={() =>
                  setPage((current) => Math.min(pageCount, current + 1))
                }
                disabled={page === pageCount || loading}
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
