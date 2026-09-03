const TONES: Record<string, string> = {
  draft: "bg-slate-700/80 text-slate-200",
  published: "bg-emerald-500/20 text-emerald-300",
  new: "bg-sky-500/20 text-sky-300",
  contacted: "bg-indigo-500/20 text-indigo-300",
  scheduled: "bg-violet-500/20 text-violet-300",
  closed: "bg-slate-600/80 text-slate-300",
  spam: "bg-rose-500/20 text-rose-300",
  reviewing: "bg-amber-500/20 text-amber-300",
  quoted: "bg-cyan-500/20 text-cyan-300",
  completed: "bg-emerald-500/20 text-emerald-300",
  cancelled: "bg-rose-500/20 text-rose-300",
  active: "bg-emerald-500/20 text-emerald-300",
  inactive: "bg-slate-600/80 text-slate-300",
  approved: "bg-emerald-500/20 text-emerald-300",
  pending: "bg-amber-500/20 text-amber-300",
  featured: "bg-amber-500/20 text-amber-200",
};

export function StatusBadge({
  status,
  className = "",
}: {
  status: string;
  className?: string;
}) {
  const key = status.toLowerCase();
  const tone = TONES[key] ?? "bg-slate-700/80 text-slate-200";
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium capitalize ${tone} ${className}`}
    >
      {status}
    </span>
  );
}
