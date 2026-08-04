import Link from "next/link";
import { MailWarning } from "lucide-react";

export function MissingEmailBanner({
  email,
  contactRecipient,
}: {
  email?: string | null;
  contactRecipient?: string | null;
}) {
  const missingBusiness = !email?.trim();
  const missingRecipient = !contactRecipient?.trim();
  if (!missingBusiness && !missingRecipient) return null;

  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
      <MailWarning className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
      <div className="flex-1">
        <p className="font-medium text-amber-50">Email settings incomplete</p>
        <p className="mt-1 text-amber-100/90">
          {missingBusiness && missingRecipient
            ? "Business email and contact recipient are empty. Inquiry and estimate notifications will not send."
            : missingBusiness
              ? "Business email is empty. Add it in Settings so the site can display a contact address."
              : "Contact recipient email is empty. Form submissions may not be delivered."}
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
