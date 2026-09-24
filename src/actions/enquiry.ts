"use server";

import { createHash } from "node:crypto";
import { appendFile } from "node:fs/promises";
import { headers } from "next/headers";
import { z } from "zod";
import { todayInMauritius } from "@/lib/dates";
import { SITE } from "@/lib/site";
import { hasSupabase, publicClient } from "@/lib/supabase/public";

export type EnquiryState =
  | { status: "idle" }
  | { status: "success"; reference: string }
  | {
      status: "error";
      message: string;
      fieldErrors: Record<string, string>;
      values: Record<string, string>;
      nonce: number;
    };

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => v || undefined);

const Schema = z.object({
  interest_type: z.enum(["activity", "package", "resource", "operator", "general"]),
  interest_id: z
    .string()
    .uuid()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  interest_label: z.string().trim().min(1).max(160),
  name: z.string().trim().min(2, "Please tell us your name.").max(120),
  email: z.string().trim().email("Please check the email address.").max(200),
  phone: optionalText(40),
  country: optionalText(80),
  preferred_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please pick a date.")
    .optional()
    .or(z.literal("").transform(() => undefined)),
  party_adults: z.coerce.number().int().min(1, "At least one adult.").max(500),
  party_children: z.coerce.number().int().min(0).max(500).default(0),
  message: optionalText(4000),
  company: optionalText(160),
  expected_volume: optionalText(80),
  source_page: optionalText(200),
});

const FIELDS = [
  "interest_type",
  "interest_id",
  "interest_label",
  "name",
  "email",
  "phone",
  "country",
  "preferred_date",
  "party_adults",
  "party_children",
  "message",
  "company",
  "expected_volume",
  "source_page",
] as const;

// Development-only fallback when no database is configured.
const devHits = new Map<string, number[]>();
let devCounter = 0;

export async function submitEnquiry(_prev: EnquiryState, form: FormData): Promise<EnquiryState> {
  const values: Record<string, string> = {};
  for (const f of FIELDS) values[f] = String(form.get(f) ?? "");
  const activities = form.getAll("activities").map(String).filter(Boolean);
  const failWith = (message: string, fieldErrors: Record<string, string> = {}): EnquiryState => ({
    status: "error",
    message,
    fieldErrors,
    values,
    nonce: Date.now(),
  });

  // Honeypot: real visitors never see this field. Look successful to the bot.
  if (String(form.get("website") ?? "") !== "") {
    return { status: "success", reference: "ENQ-RECEIVED" };
  }
  const startedAt = Number(form.get("started_at") ?? 0);
  if (startedAt && Date.now() - startedAt < 2000) {
    return failWith("That was very quick. Please check your details and send it again.");
  }

  const parsed = Schema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "");
      fieldErrors[key] ??= issue.message;
    }
    return failWith("Please check the highlighted fields.", fieldErrors);
  }
  const d = parsed.data;
  if (d.preferred_date && d.preferred_date < todayInMauritius()) {
    return failWith("Please check the highlighted fields.", {
      preferred_date: "That date has already passed.",
    });
  }

  let message = d.message ?? "";
  if (d.interest_type === "operator") {
    const lines = [
      d.company && `Company: ${d.company}`,
      d.expected_volume && `Expected monthly volume: ${d.expected_volume}`,
      activities.length && `Activities of interest: ${activities.join(", ")}`,
    ].filter(Boolean);
    message = [...lines, message].filter(Boolean).join("\n");
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  const ipHash = createHash("sha256")
    .update(`${process.env.ENQUIRY_IP_SALT ?? "dev-salt"}:${ip}`)
    .digest("hex");

  const payload = {
    name: d.name,
    email: d.email,
    phone: d.phone ?? null,
    country: d.country ?? null,
    preferred_date: d.preferred_date ?? null,
    party_adults: d.party_adults,
    party_children: d.party_children,
    message: message || null,
    interest_type: d.interest_type,
    interest_id: d.interest_id ?? null,
    interest_label: d.interest_label,
    source_page: d.source_page ?? null,
    ip_hash: ipHash,
    user_agent: h.get("user-agent")?.slice(0, 300) ?? null,
  };

  let reference: string;
  if (hasSupabase()) {
    const { data, error } = await publicClient().rpc("submit_enquiry", { payload });
    if (error) {
      console.error("submit_enquiry failed", error.message);
      if (error.message.includes("rate_limited")) {
        return failWith(
          "We have already received several enquiries from this connection in the last hour. Please try again later, or message us on WhatsApp.",
        );
      }
      return failWith(
        "Something went wrong on our side and your enquiry was not sent. Please try again, or email us directly.",
      );
    }
    reference = (data as { reference: string }).reference;
  } else {
    // No database yet: apply the same five-per-hour rule and log locally.
    const now = Date.now();
    const recent = (devHits.get(ipHash) ?? []).filter((t) => now - t < 3_600_000);
    if (recent.length >= 5) {
      return failWith(
        "We have already received several enquiries from this connection in the last hour. Please try again later, or message us on WhatsApp.",
      );
    }
    devHits.set(ipHash, [...recent, now]);
    devCounter += 1;
    reference = `ENQ-${todayInMauritius().replaceAll("-", "")}-${String(devCounter).padStart(4, "0")}`;
    const line = JSON.stringify({ reference, ...payload, received_at: new Date().toISOString() });
    console.info("[enquiry:dev]", line);
    await appendFile(".dev-enquiries.jsonl", `${line}\n`).catch(() => undefined);
  }

  // Notification must never block or undo a saved enquiry.
  await notifyReception(reference, payload).catch((e) =>
    console.error("enquiry notification failed", reference, e),
  );

  return { status: "success", reference };
}

async function notifyReception(reference: string, p: Record<string, unknown>) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const admin = process.env.ADMIN_BASE_URL;
  const text = [
    `New enquiry ${reference}`,
    ``,
    `Interest: ${p.interest_label} (${p.interest_type})`,
    `Name: ${p.name}`,
    `Email: ${p.email}`,
    `Phone: ${p.phone ?? "—"}`,
    `Country: ${p.country ?? "—"}`,
    `Preferred date: ${p.preferred_date ?? "—"}`,
    `Party: ${p.party_adults} adults, ${p.party_children} children`,
    ``,
    String(p.message ?? ""),
    ``,
    admin ? `Open in the admin: ${admin}/enquiries?ref=${reference}` : "",
  ].join("\n");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.ENQUIRY_NOTIFY_FROM ?? `AquaSail Website <website@example.com>`,
      to: [process.env.ENQUIRY_NOTIFY_TO ?? SITE.email],
      reply_to: p.email,
      subject: `${reference} · ${p.interest_label} · ${p.name}`,
      text,
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}
