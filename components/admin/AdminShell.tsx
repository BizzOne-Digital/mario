"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ToastProvider } from "@/components/admin/Toast";

const AdminShellContext = createContext<{ openSidebar: () => void }>({
  openSidebar: () => undefined,
});

export function useAdminShell() {
  return useContext(AdminShellContext);
}

export function AdminShell({
  session: serverSession,
  children,
}: {
  session: Session | null;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: clientSession, status } = useSession();
  const session = clientSession ?? serverSession;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isLogin =
    pathname === "/admin/login" || pathname.startsWith("/admin/login/");

  useEffect(() => {
    const id = window.setTimeout(() => setSidebarOpen(false), 0);
    return () => window.clearTimeout(id);
  }, [pathname]);

  useEffect(() => {
    if (!isLogin && status !== "loading" && !session) {
      router.replace("/admin/login");
    }
  }, [isLogin, session, status, router]);

  if (isLogin) {
    return <ToastProvider>{children}</ToastProvider>;
  }

  if (status === "loading" && !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-sm text-slate-400">
        Checking session…
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-sm text-slate-400">
        Redirecting to login…
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="fixed inset-0 z-50 flex bg-slate-950 text-slate-100">
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <AdminShellContext.Provider value={{ openSidebar: () => setSidebarOpen(true) }}>
            <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
          </AdminShellContext.Provider>
        </div>
      </div>
    </ToastProvider>
  );
}
