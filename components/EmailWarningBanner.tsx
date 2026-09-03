import { BUSINESS } from "@/lib/constants";

export function EmailWarningBanner({ email }: { email: string }) {
  if (email.trim()) return null;
  return (
    <div className="border-b border-accent/25 bg-accent/10 px-4 py-2 text-center text-xs text-frost/80">
      Email pending configuration — please call{" "}
      <a href={`tel:${BUSINESS.primaryPhoneTel}`} className="text-glass underline-offset-2 hover:underline">
        {BUSINESS.primaryPhone}
      </a>{" "}
      for the fastest response.
    </div>
  );
}
