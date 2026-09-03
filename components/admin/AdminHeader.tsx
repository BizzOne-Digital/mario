"use client";

import type { ReactNode } from "react";
import { Menu } from "lucide-react";
import { useSession } from "next-auth/react";

export function AdminHeader({
  title,
  onMenuClick,
  actions,
}: {
  title: string;
  onMenuClick?: () => void;
  actions?: ReactNode;
}) {
  const { data } = useSession();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-slate-800 bg-slate-950/95 px-4 backdrop-blur">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          className="rounded-lg border border-slate-700 p-2 text-slate-300 hover:bg-slate-900 lg:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold text-slate-50">{title}</h1>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {actions}
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-200">{data?.user?.name || "Admin"}</p>
          <p className="text-xs text-slate-500">{data?.user?.email}</p>
        </div>
      </div>
    </header>
  );
}
