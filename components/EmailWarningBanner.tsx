export function EmailWarningBanner({ email }: { email: string }) {
  if (email.trim()) return null;
  return (
    <div className="border-b border-accent/25 bg-accent/10 px-4 py-2 text-center text-xs text-frost/80">
      Email pending configuration — please call{" "}
      <a href="tel:+19514070868" className="text-glass underline-offset-2 hover:underline">
        (951) 407-0868
      </a>{" "}
      for the fastest response.
    </div>
  );
}
