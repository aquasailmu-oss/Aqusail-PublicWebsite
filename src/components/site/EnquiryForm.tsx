"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActionState, useEffect, useRef } from "react";
import { submitEnquiry, type EnquiryState } from "@/actions/enquiry";
import type { InterestType } from "@/lib/database.types";
import { todayInMauritius } from "@/lib/dates";

export type Interest = { type: InterestType; id?: string; label: string };

type Props = {
  interest?: Interest;
  variant?: "standard" | "partner";
  activityOptions?: string[];
  onClose?: () => void;
};

const initial: EnquiryState = { status: "idle" };

/**
 * One form for the modal, /contact and /partners. Works without JavaScript on
 * /contact (a plain form post to the Server Action); with JavaScript it keeps
 * every field filled on failure and swaps to a confirmation on success.
 */
export function EnquiryForm({
  interest,
  variant = "standard",
  activityOptions = [],
  onClose,
}: Props) {
  const [state, action, pending] = useActionState(submitEnquiry, initial);
  const pathname = usePathname();
  const started = useRef<HTMLInputElement>(null);
  const it: Interest =
    interest ??
    (variant === "partner"
      ? { type: "operator", label: "Partner enquiry" }
      : { type: "general", label: "General enquiry" });

  useEffect(() => {
    if (started.current) started.current.value = String(Date.now());
  }, [state]);

  if (state.status === "success") {
    return (
      <div className="form-done" role="status">
        <span className="eyebrow">Enquiry received</span>
        <p className="disp disp-sm">Thank you</p>
        <p style={{ margin: 0, color: "var(--text-soft)" }}>
          Your reference is <span className="ref">{state.reference}</span>
        </p>
        <p style={{ margin: 0, color: "var(--text-soft)", maxWidth: "40ch" }}>
          We reply within one working day with availability and a quote. Nothing has been booked or
          charged.
        </p>
        {onClose ? (
          <button type="button" className="pill" onClick={onClose} data-autofocus>
            Close
          </button>
        ) : null}
      </div>
    );
  }

  const v = state.status === "error" ? state.values : {};
  const fe = state.status === "error" ? state.fieldErrors : {};
  const err = (name: string) =>
    fe[name] ? (
      <span className="fld-err" id={`${name}-err`}>
        {fe[name]}
      </span>
    ) : null;
  const inv = (name: string) =>
    fe[name] ? { "aria-invalid": true, "aria-describedby": `${name}-err` } : {};
  const nonce = state.status === "error" ? state.nonce : 0;

  return (
    <form action={action} className="form" key={nonce} noValidate={false}>
      {state.status === "error" ? (
        <p className="form-error" role="alert">
          {state.message}
        </p>
      ) : null}

      <input type="hidden" name="interest_type" value={it.type} />
      <input type="hidden" name="interest_id" value={it.id ?? ""} />
      <input type="hidden" name="source_page" value={pathname} />
      <input type="hidden" name="started_at" ref={started} defaultValue="" />
      <div className="hp" aria-hidden="true">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="fld">
        <label htmlFor="f-interest">Interested in</label>
        <input id="f-interest" name="interest_label" readOnly value={it.label} />
      </div>

      {variant === "partner" ? (
        <div className="fld-row">
          <div className="fld" data-invalid={fe.company ? "" : undefined}>
            <label htmlFor="f-company">Company</label>
            <input
              id="f-company"
              name="company"
              required
              autoComplete="organization"
              defaultValue={v.company}
              {...inv("company")}
            />
            {err("company")}
          </div>
          <div className="fld">
            <label htmlFor="f-volume">
              Expected monthly volume <span className="opt">guests</span>
            </label>
            <select id="f-volume" name="expected_volume" defaultValue={v.expected_volume || ""}>
              <option value="">Choose a range</option>
              <option>Under 50</option>
              <option>50 – 200</option>
              <option>200 – 500</option>
              <option>More than 500</option>
            </select>
          </div>
        </div>
      ) : null}

      <div className="fld-row">
        <div className="fld" data-invalid={fe.name ? "" : undefined}>
          <label htmlFor="f-name">{variant === "partner" ? "Your name" : "Name"}</label>
          <input
            id="f-name"
            name="name"
            required
            autoComplete="name"
            defaultValue={v.name}
            data-autofocus
            {...inv("name")}
          />
          {err("name")}
        </div>
        <div className="fld" data-invalid={fe.email ? "" : undefined}>
          <label htmlFor="f-email">Email</label>
          <input
            id="f-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={v.email}
            {...inv("email")}
          />
          {err("email")}
        </div>
      </div>

      <div className="fld-row">
        <div className="fld">
          <label htmlFor="f-phone">
            Phone or WhatsApp <span className="opt">optional</span>
          </label>
          <input id="f-phone" name="phone" type="tel" autoComplete="tel" defaultValue={v.phone} />
        </div>
        <div className="fld">
          <label htmlFor="f-country">
            Country <span className="opt">optional</span>
          </label>
          <input
            id="f-country"
            name="country"
            autoComplete="country-name"
            defaultValue={v.country}
          />
        </div>
      </div>

      {variant === "standard" ? (
        <div className="fld-row">
          <div className="fld" data-invalid={fe.preferred_date ? "" : undefined}>
            <label htmlFor="f-date">
              Preferred date <span className="opt">optional</span>
            </label>
            <input
              id="f-date"
              name="preferred_date"
              type="date"
              min={todayInMauritius()}
              suppressHydrationWarning
              defaultValue={v.preferred_date}
              {...inv("preferred_date")}
            />
            {err("preferred_date")}
          </div>
          <div className="fld-row" style={{ gridTemplateColumns: "1fr 1fr" }}>
            <div className="fld" data-invalid={fe.party_adults ? "" : undefined}>
              <label htmlFor="f-adults">Adults</label>
              <input
                id="f-adults"
                name="party_adults"
                type="number"
                min={1}
                max={500}
                required
                defaultValue={v.party_adults || "2"}
                {...inv("party_adults")}
              />
              {err("party_adults")}
            </div>
            <div className="fld">
              <label htmlFor="f-children">Children</label>
              <input
                id="f-children"
                name="party_children"
                type="number"
                min={0}
                max={500}
                defaultValue={v.party_children || "0"}
              />
            </div>
          </div>
        </div>
      ) : (
        <>
          <input type="hidden" name="party_adults" value="1" />
          <input type="hidden" name="party_children" value="0" />
          {activityOptions.length ? (
            <fieldset className="fld">
              <legend>Which activities</legend>
              <div className="checks">
                {activityOptions.map((a) => (
                  <label key={a}>
                    <input type="checkbox" name="activities" value={a} /> {a}
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}
        </>
      )}

      <div className="fld">
        <label htmlFor="f-msg">
          {variant === "partner" ? "Tell us about your guests" : "Anything we should know"}{" "}
          <span className="opt">optional</span>
        </label>
        <textarea
          id="f-msg"
          name="message"
          defaultValue={v.message}
          placeholder={
            variant === "partner"
              ? "Hotel or agency, typical group sizes, the season you are planning for"
              : "Ages of children, swimming confidence, dietary needs, hotel pick-up"
          }
        />
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <button className="pill pill-solid" type="submit" disabled={pending} aria-busy={pending}>
          {pending ? "Sending…" : "Send enquiry"}
        </button>
        {onClose ? (
          <button className="pill" type="button" onClick={onClose}>
            Cancel
          </button>
        ) : null}
      </div>
      <p className="form-note">
        We use these details only to reply to this enquiry. Nothing is booked or charged here. See
        our <Link href="/legal/privacy">privacy notice</Link>.
      </p>
    </form>
  );
}
