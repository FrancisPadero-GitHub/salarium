"use client";

import {
  Building2,
  Users,
  CheckCircle2,
  Archive,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSuperAdminStats } from "@/hooks/super-admin/useSuperAdminStats";
import { useFetchCompanies } from "@/hooks/super-admin/useFetchCompanies";
import { formatDistanceToNow } from "date-fns";

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
  color,
  bg,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  sub: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <div className={cn("rounded-md p-1.5", bg)}>
          <Icon className={cn("h-3.5 w-3.5", color)} />
        </div>
      </div>
      <p className={cn("mt-2 text-2xl font-bold tabular-nums", color)}>
        {value}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

export default function SuperAdminPage() {
  const {
    data: stats,
    isLoading: statsLoading,
    isError: statsError,
  } = useSuperAdminStats();
  const { data: companies, isLoading: companiesLoading } = useFetchCompanies();

  const recentCompanies = (companies ?? []).slice(0, 5);
  const isLoading = statsLoading || companiesLoading;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Overview
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Platform-wide stats across all tenants
        </p>
      </div>

      {/* KPIs */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : statsError ? (
        <div className="flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 px-5 py-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Failed to load stats.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Companies"
            value={stats?.totalCompanies ?? 0}
            icon={Building2}
            sub="All registered tenants"
            color="text-foreground"
            bg="bg-muted"
          />
          <StatCard
            label="Active Companies"
            value={stats?.activeCompanies ?? 0}
            icon={CheckCircle2}
            sub="Currently active"
            color="text-success"
            bg="bg-success/10"
          />
          <StatCard
            label="Inactive Companies"
            value={stats?.inactiveCompanies ?? 0}
            icon={Archive}
            sub="Disabled tenants"
            color="text-muted-foreground"
            bg="bg-muted"
          />
          <StatCard
            label="Total VA"
            value={stats?.totalUsers ?? 0}
            icon={Users}
            sub="Across all companies"
            color="text-primary"
            bg="bg-primary/10"
          />
        </div>
      )}

      {/* Recently Added Companies */}
      {!isLoading && (
        <div className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <h3 className="text-base font-semibold text-foreground">
              Recently Added Companies
            </h3>
            <p className="text-xs text-muted-foreground">
              Last 5 registered tenants
            </p>
          </div>

          {recentCompanies.length === 0 ? (
            <p className="px-6 py-8 text-center text-sm text-muted-foreground">
              No companies yet.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {recentCompanies.map((company) => {
                const isActive = company.deleted_at === null;
                return (
                  <li
                    key={company.id}
                    className="flex items-center justify-between px-6 py-3.5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {company.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(company.created_at), {
                            addSuffix: true,
                          })}
                          {" · "}
                          {company.user_count}{" "}
                          {company.user_count === 1 ? "user" : "users"}
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                        isActive
                          ? "bg-success/10 text-success"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
