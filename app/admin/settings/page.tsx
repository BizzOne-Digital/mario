"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { MissingEmailBanner } from "@/components/admin/MissingEmailBanner";
import { useToast } from "@/components/admin/Toast";
import { adminFetch } from "@/lib/admin-client";
import type {
  FooterLink,
  SiteSettingsDoc,
  SocialLink,
} from "@/lib/types";

interface Payload {
  settings?: SiteSettingsDoc;
}

function fieldClass() {
  return "mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100 outline-none focus:border-cyan-500";
}

export default function AdminSettingsPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<SiteSettingsDoc | null>(null);
  const [newArea, setNewArea] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminFetch<Payload>("/api/admin/settings");
      setSettings(data.settings ?? null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load settings");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void load();
  }, [load]);

  function patch<K extends keyof SiteSettingsDoc>(key: K, value: SiteSettingsDoc[K]) {
    setSettings((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function save() {
    if (!settings) return;
    setSaving(true);
    try {
      const {
        _id: _ignored,
        createdAt: _c,
        updatedAt: _u,
        ...body
      } = settings;
      void _ignored;
      void _c;
      void _u;
      const data = await adminFetch<Payload>("/api/admin/settings", {
        method: "PUT",
        body: JSON.stringify(body),
      });
      setSettings(data.settings ?? settings);
      toast.success("Settings saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !settings) {
    return (
      <AdminPage title="Settings">
        <p className="text-sm text-slate-400">{loading ? "Loading…" : "Settings unavailable."}</p>
      </AdminPage>
    );
  }

  const areas = settings.serviceAreas ?? [];
  const socialLinks = settings.socialLinks ?? [];
  const footerLinks = settings.footerLinks ?? [];

  return (
    <AdminPage
      title="Settings"
      actions={
        <button
          type="button"
          disabled={saving}
          onClick={() => void save()}
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-3 py-1.5 text-sm font-semibold text-slate-950 disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Save settings
        </button>
      }
    >
      <MissingEmailBanner
        email={settings.email}
        contactRecipient={settings.contactRecipient}
      />

      <section className="grid gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 md:grid-cols-2">
        <h2 className="text-sm font-semibold text-slate-200 md:col-span-2">Business</h2>
        <label className="block text-sm text-slate-300">
          Business name
          <input value={settings.businessName} onChange={(e) => patch("businessName", e.target.value)} className={fieldClass()} />
        </label>
        <label className="block text-sm text-slate-300">
          Owner name
          <input value={settings.ownerName} onChange={(e) => patch("ownerName", e.target.value)} className={fieldClass()} />
        </label>
        <label className="block text-sm text-slate-300">
          Primary phone
          <input value={settings.primaryPhone} onChange={(e) => patch("primaryPhone", e.target.value)} className={fieldClass()} />
        </label>
        <label className="block text-sm text-slate-300">
          Secondary phone
          <input value={settings.secondaryPhone} onChange={(e) => patch("secondaryPhone", e.target.value)} className={fieldClass()} />
        </label>
        <label className="block text-sm text-slate-300">
          Fax
          <input
            value={settings.faxPhone ?? ""}
            onChange={(e) => patch("faxPhone", e.target.value)}
            className={fieldClass()}
            placeholder="(951) 496-4305"
          />
        </label>
        <label className="block text-sm text-slate-300">
          Business email
          <input
            type="email"
            value={settings.email}
            onChange={(e) => patch("email", e.target.value)}
            className={`${fieldClass()} ${!settings.email.trim() ? "border-amber-500/60" : ""}`}
          />
        </label>
        <label className="block text-sm text-slate-300">
          Contact recipient (notifications)
          <input
            type="email"
            value={settings.contactRecipient}
            onChange={(e) => patch("contactRecipient", e.target.value)}
            className={`${fieldClass()} ${!settings.contactRecipient.trim() ? "border-amber-500/60" : ""}`}
          />
        </label>
        <label className="block text-sm text-slate-300 md:col-span-2">
          Address
          <input value={settings.address} onChange={(e) => patch("address", e.target.value)} className={fieldClass()} />
        </label>
        <label className="block text-sm text-slate-300">
          Hours
          <input value={settings.hours} onChange={(e) => patch("hours", e.target.value)} className={fieldClass()} />
        </label>
        <label className="block text-sm text-slate-300">
          Saturday hours
          <input value={settings.saturdayHours} onChange={(e) => patch("saturdayHours", e.target.value)} className={fieldClass()} />
        </label>
        <label className="block text-sm text-slate-300">
          License number
          <input value={settings.licenseNumber} onChange={(e) => patch("licenseNumber", e.target.value)} className={fieldClass()} />
        </label>
        <label className="block text-sm text-slate-300">
          Years experience text
          <input value={settings.yearsExperienceText} onChange={(e) => patch("yearsExperienceText", e.target.value)} className={fieldClass()} />
        </label>
        <label className="block text-sm text-slate-300 md:col-span-2">
          Mobile service notice
          <textarea rows={2} value={settings.mobileServiceNotice} onChange={(e) => patch("mobileServiceNotice", e.target.value)} className={fieldClass()} />
        </label>
        <label className="block text-sm text-slate-300 md:col-span-2">
          Company history
          <textarea rows={4} value={settings.companyHistory} onChange={(e) => patch("companyHistory", e.target.value)} className={fieldClass()} />
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={settings.licensedBondedInsured}
            onChange={(e) => patch("licensedBondedInsured", e.target.checked)}
          />
          Licensed, bonded & insured
        </label>
      </section>

      <section className="grid gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 md:grid-cols-3">
        <h2 className="text-sm font-semibold text-slate-200 md:col-span-3">Logos</h2>
        <ImageUploader
          label="Logo"
          value={settings.logo}
          folder="branding"
          onChange={(url) => patch("logo", url)}
        />
        <ImageUploader
          label="Dark logo"
          value={settings.logoDark}
          folder="branding"
          onChange={(url) => patch("logoDark", url)}
        />
        <ImageUploader
          label="Favicon"
          value={settings.favicon}
          folder="branding"
          onChange={(url) => patch("favicon", url)}
        />
      </section>

      <section className="grid gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 md:grid-cols-2">
        <h2 className="text-sm font-semibold text-slate-200 md:col-span-2">Feature toggles</h2>
        <label className="inline-flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={settings.specialOfferEnabled}
            onChange={(e) => patch("specialOfferEnabled", e.target.checked)}
          />
          Special offer enabled
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={settings.introEnabled}
            onChange={(e) => patch("introEnabled", e.target.checked)}
          />
          Intro animation enabled
        </label>
        <label className="block text-sm text-slate-300 md:col-span-2">
          Special offer text
          <input value={settings.specialOfferText} onChange={(e) => patch("specialOfferText", e.target.value)} className={fieldClass()} />
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={settings.christianOwnedVisible}
            onChange={(e) => patch("christianOwnedVisible", e.target.checked)}
          />
          Show Christian-owned badge
        </label>
        <label className="block text-sm text-slate-300 md:col-span-2">
          Christian-owned text
          <input value={settings.christianOwnedText} onChange={(e) => patch("christianOwnedText", e.target.value)} className={fieldClass()} />
        </label>
      </section>

      <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="text-sm font-semibold text-slate-200">Manufacturers / partners</h2>
        <label className="block text-sm text-slate-300">
          Partner text
          <textarea
            rows={3}
            value={settings.manufacturersPartners?.text ?? ""}
            onChange={(e) =>
              patch("manufacturersPartners", {
                text: e.target.value,
                authorizedInstallerConfirmed:
                  settings.manufacturersPartners?.authorizedInstallerConfirmed ?? false,
              })
            }
            className={fieldClass()}
          />
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={settings.manufacturersPartners?.authorizedInstallerConfirmed ?? false}
            onChange={(e) =>
              patch("manufacturersPartners", {
                text: settings.manufacturersPartners?.text ?? "",
                authorizedInstallerConfirmed: e.target.checked,
              })
            }
          />
          Authorized installer confirmed
        </label>
      </section>

      <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="text-sm font-semibold text-slate-200">Service areas</h2>
        <div className="flex flex-wrap gap-2">
          {areas.map((area, i) => (
            <span
              key={`${area}-${i}`}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-950 px-3 py-1.5 text-sm text-slate-200"
            >
              {area}
              <button
                type="button"
                onClick={() => patch("serviceAreas", areas.filter((_, idx) => idx !== i))}
                className="text-rose-300"
                aria-label={`Remove ${area}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={newArea}
            onChange={(e) => setNewArea(e.target.value)}
            placeholder="Add city / area"
            className={fieldClass()}
          />
          <button
            type="button"
            onClick={() => {
              const value = newArea.trim();
              if (!value) return;
              patch("serviceAreas", [...areas, value]);
              setNewArea("");
            }}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-600 px-3 text-sm text-cyan-300"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </section>

      <section className="grid gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 md:grid-cols-2">
        <h2 className="text-sm font-semibold text-slate-200 md:col-span-2">Footer & social</h2>
        <label className="block text-sm text-slate-300 md:col-span-2">
          Footer description
          <textarea rows={3} value={settings.footerDescription} onChange={(e) => patch("footerDescription", e.target.value)} className={fieldClass()} />
        </label>
        <label className="block text-sm text-slate-300">
          Facebook URL
          <input value={settings.facebookUrl} onChange={(e) => patch("facebookUrl", e.target.value)} className={fieldClass()} />
        </label>
        <label className="block text-sm text-slate-300">
          Map embed
          <textarea rows={2} value={settings.mapEmbed} onChange={(e) => patch("mapEmbed", e.target.value)} className={fieldClass()} />
        </label>

        <div className="md:col-span-2 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-200">Social links</span>
            <button
              type="button"
              className="text-xs text-cyan-300"
              onClick={() =>
                patch("socialLinks", [
                  ...socialLinks,
                  { platform: "", url: "", label: "" } satisfies SocialLink,
                ])
              }
            >
              Add link
            </button>
          </div>
          {socialLinks.map((link, i) => (
            <div key={`social-${i}`} className="grid gap-2 md:grid-cols-[1fr_1fr_1fr_auto]">
              <input
                placeholder="Platform"
                value={link.platform}
                onChange={(e) => {
                  const next = [...socialLinks];
                  next[i] = { ...next[i], platform: e.target.value };
                  patch("socialLinks", next);
                }}
                className={fieldClass()}
              />
              <input
                placeholder="Label"
                value={link.label}
                onChange={(e) => {
                  const next = [...socialLinks];
                  next[i] = { ...next[i], label: e.target.value };
                  patch("socialLinks", next);
                }}
                className={fieldClass()}
              />
              <input
                placeholder="URL"
                value={link.url}
                onChange={(e) => {
                  const next = [...socialLinks];
                  next[i] = { ...next[i], url: e.target.value };
                  patch("socialLinks", next);
                }}
                className={fieldClass()}
              />
              <button
                type="button"
                onClick={() => patch("socialLinks", socialLinks.filter((_, idx) => idx !== i))}
                className="rounded-lg border border-slate-700 p-2 text-rose-300"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="md:col-span-2 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-200">Footer links</span>
            <button
              type="button"
              className="text-xs text-cyan-300"
              onClick={() =>
                patch("footerLinks", [
                  ...footerLinks,
                  { label: "", href: "" } satisfies FooterLink,
                ])
              }
            >
              Add link
            </button>
          </div>
          {footerLinks.map((link, i) => (
            <div key={`footer-${i}`} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
              <input
                placeholder="Label"
                value={link.label}
                onChange={(e) => {
                  const next = [...footerLinks];
                  next[i] = { ...next[i], label: e.target.value };
                  patch("footerLinks", next);
                }}
                className={fieldClass()}
              />
              <input
                placeholder="Href"
                value={link.href}
                onChange={(e) => {
                  const next = [...footerLinks];
                  next[i] = { ...next[i], href: e.target.value };
                  patch("footerLinks", next);
                }}
                className={fieldClass()}
              />
              <button
                type="button"
                onClick={() => patch("footerLinks", footerLinks.filter((_, idx) => idx !== i))}
                className="rounded-lg border border-slate-700 p-2 text-rose-300"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 md:grid-cols-2">
        <h2 className="text-sm font-semibold text-slate-200 md:col-span-2">SEO & analytics</h2>
        <label className="block text-sm text-slate-300">
          Default SEO title
          <input
            value={settings.defaultSeo?.title ?? ""}
            onChange={(e) =>
              patch("defaultSeo", {
                title: e.target.value,
                description: settings.defaultSeo?.description ?? "",
                ogImage: settings.defaultSeo?.ogImage ?? "",
              })
            }
            className={fieldClass()}
          />
        </label>
        <label className="block text-sm text-slate-300">
          Default OG image
          <input
            value={settings.defaultSeo?.ogImage ?? ""}
            onChange={(e) =>
              patch("defaultSeo", {
                title: settings.defaultSeo?.title ?? "",
                description: settings.defaultSeo?.description ?? "",
                ogImage: e.target.value,
              })
            }
            className={fieldClass()}
          />
        </label>
        <label className="block text-sm text-slate-300 md:col-span-2">
          Default SEO description
          <textarea
            rows={2}
            value={settings.defaultSeo?.description ?? ""}
            onChange={(e) =>
              patch("defaultSeo", {
                title: settings.defaultSeo?.title ?? "",
                description: e.target.value,
                ogImage: settings.defaultSeo?.ogImage ?? "",
              })
            }
            className={fieldClass()}
          />
        </label>
        <label className="block text-sm text-slate-300">
          Google Analytics ID
          <input
            value={settings.analyticsIds?.googleAnalyticsId ?? ""}
            onChange={(e) =>
              patch("analyticsIds", {
                googleAnalyticsId: e.target.value,
                googleTagManagerId: settings.analyticsIds?.googleTagManagerId ?? "",
                facebookPixelId: settings.analyticsIds?.facebookPixelId ?? "",
              })
            }
            className={fieldClass()}
          />
        </label>
        <label className="block text-sm text-slate-300">
          Google Tag Manager ID
          <input
            value={settings.analyticsIds?.googleTagManagerId ?? ""}
            onChange={(e) =>
              patch("analyticsIds", {
                googleAnalyticsId: settings.analyticsIds?.googleAnalyticsId ?? "",
                googleTagManagerId: e.target.value,
                facebookPixelId: settings.analyticsIds?.facebookPixelId ?? "",
              })
            }
            className={fieldClass()}
          />
        </label>
        <label className="block text-sm text-slate-300 md:col-span-2">
          Facebook Pixel ID
          <input
            value={settings.analyticsIds?.facebookPixelId ?? ""}
            onChange={(e) =>
              patch("analyticsIds", {
                googleAnalyticsId: settings.analyticsIds?.googleAnalyticsId ?? "",
                googleTagManagerId: settings.analyticsIds?.googleTagManagerId ?? "",
                facebookPixelId: e.target.value,
              })
            }
            className={fieldClass()}
          />
        </label>
      </section>
    </AdminPage>
  );
}
