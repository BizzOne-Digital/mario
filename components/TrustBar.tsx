import { BadgeCheck, ClipboardList, MapPin, Shield, Truck } from "lucide-react";
import { BUSINESS } from "@/lib/constants";

const items = [
  { icon: Shield, label: "Licensed, Bonded & Insured" },
  { icon: BadgeCheck, label: `CA License #${BUSINESS.licenseNumber}` },
  { icon: Truck, label: "Mobile Service" },
  { icon: ClipboardList, label: "Free Estimates" },
  { icon: MapPin, label: BUSINESS.yearsExperience },
];

export function TrustBar({ className = "" }: { className?: string }) {
  return (
    <div className={`glass-panel-strong rounded-2xl ${className}`}>
      <ul className="grid gap-4 px-4 py-5 sm:grid-cols-2 lg:grid-cols-5 lg:px-6">
        {items.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-3 text-sm text-frost/90">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-glass/30 bg-navy/50 text-glass">
              <Icon className="h-4 w-4" aria-hidden />
            </span>
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
