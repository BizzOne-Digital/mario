import { getSession } from "@/lib/auth";
import { Providers } from "@/components/admin/Providers";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <Providers>
      <AdminShell session={session}>{children}</AdminShell>
    </Providers>
  );
}
