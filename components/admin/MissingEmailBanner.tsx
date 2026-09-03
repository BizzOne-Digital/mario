import Link from "next/link";
import { MailWarning } from "lucide-react";

export function MissingEmailBanner({ email }: { email?: string | null }) {
  if (email?.trim()) return null;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
      <MailWarning className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
      <div className="flex-1">
        <p className="font-medium text-amber-50">Email settings incomplete</p>
        <p className="mt-1 text-amber-100/90">
          Business email is empty. Add it in Settings so the site can display a contact
          address and form notifications can send.
        </p>
        <Link
          href="/admin/settings"
          className="mt-2 inline-block font-medium text-amber-200 underline underline-offset-2 hover:text-white"
        >
          Open Settings
        </Link>
      </div>
    </div>
  );
}
