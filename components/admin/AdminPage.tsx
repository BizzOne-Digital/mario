"use client";

import type { ReactNode } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAdminShell } from "@/components/admin/AdminShell";

export function AdminPage({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { openSidebar } = useAdminShell();

  return (
    <>
      <AdminHeader title={title} onMenuClick={openSidebar} actions={actions} />
      <div className="space-y-6 p-4 md:p-6">{children}</div>
    </>
  );
}
