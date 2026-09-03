"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { contactSchema } from "@/lib/validations";
import { SERVICES } from "@/lib/site-content";
import { MagneticButton } from "@/components/MagneticButton";

const formSchema = contactSchema.extend({
  consent: z.boolean().refine((v) => v === true, { message: "Consent is required" }),
});

type ContactValues = z.output<typeof formSchema>;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      service: SERVICES[0]?.name ?? "",
      propertyType: "Residential",
      location: "",
      preferredMethod: "Phone",
      preferredDate: "",
      message: "",
      website: "",
      consent: false,
    },
  });

  const onSubmit: SubmitHandler<ContactValues> = async (values) => {
    setStatus("loading");
    setMessage("");
    try {
      const { consent, ...payload } = values;
      void consent;
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
          details?: Array<{ message?: string; path?: Array<string | number> }>;
        } | null;
        if (data?.error === "Validation failed" && Array.isArray(data.details)) {
          const first = data.details[0];
          const field = first?.path?.[0];
          throw new Error(
            first?.message
              ? `${field ? `${String(field)}: ` : ""}${first.message}`
              : "Please check the form and try again.",
          );
        }
        throw new Error(data?.error || "Unable to send message.");
      }
      setStatus("success");
      setMessage("Thank you. Your message has been received — check your email for a confirmation.");
      reset();
    } catch (err) {
      setStatus("error");
      if (err instanceof TypeError) {
        setMessage(
          "Could not reach the server. Refresh the page and try again, or call (951) 371-2601.",
        );
      } else {
        setMessage(err instanceof Error ? err.message : "Something went wrong.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="glass-panel space-y-4 rounded-2xl p-6 md:p-8">
      <div className="sr-only-hp" aria-hidden>
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Full name" error={errors.fullName?.message}>
          <input className="input-eg" {...register("fullName")} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input type="email" className="input-eg" {...register("email")} />
        </Field>
        <Field label="Phone" error={errors.phone?.message}>
          <input className="input-eg" {...register("phone")} />
        </Field>
        <Field label="Service" error={errors.service?.message}>
          <select className="input-eg" {...register("service")}>
            {SERVICES.map((s) => (
              <option key={s.slug} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Property type" error={errors.propertyType?.message}>
          <select className="input-eg" {...register("propertyType")}>
            <option>Residential</option>
            <option>Commercial</option>
          </select>
        </Field>
        <Field label="Property location" error={errors.location?.message}>
          <input className="input-eg" placeholder="City / area" {...register("location")} />
        </Field>
        <Field label="Preferred contact method" error={errors.preferredMethod?.message}>
          <select className="input-eg" {...register("preferredMethod")}>
            <option>Phone</option>
            <option>Email</option>
            <option>Either</option>
          </select>
        </Field>
        <Field label="Preferred appointment date" error={errors.preferredDate?.message}>
          <input type="date" className="input-eg" {...register("preferredDate")} />
        </Field>
      </div>

      <Field label="Message" error={errors.message?.message}>
        <textarea rows={5} className="input-eg" {...register("message")} />
      </Field>

      <label className="flex items-start gap-3 text-sm text-steel">
        <input type="checkbox" className="mt-1" {...register("consent")} />
        <span>I agree to be contacted about my glass project request.</span>
      </label>
      {errors.consent ? (
        <p className="text-sm text-accent">{errors.consent.message}</p>
      ) : null}

      <MagneticButton type="submit" className="btn-primary" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Send Message"}
      </MagneticButton>

      {message ? (
        <p className={`text-sm ${status === "success" ? "text-glass" : "text-accent"}`}>{message}</p>
      ) : null}
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5 text-sm">
      <span className="text-frost/90">{label}</span>
      {children}
      {error ? <span className="block text-accent">{error}</span> : null}
    </label>
  );
}
