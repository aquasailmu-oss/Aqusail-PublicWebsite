"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { EnquiryForm, type Interest } from "./EnquiryForm";
import { useDialog } from "./useDialog";
import { Wave } from "./Brand";

type Ctx = { open: (interest?: Interest) => void };
const EnquiryContext = createContext<Ctx>({ open: () => undefined });

/** Mounted once in the site layout; any Enquire button can open the modal. */
export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ open: boolean; interest?: Interest; n: number }>({
    open: false,
    n: 0,
  });
  const open = useCallback(
    (interest?: Interest) => setState((s) => ({ open: true, interest, n: s.n + 1 })),
    [],
  );
  const close = useCallback(() => setState((s) => ({ ...s, open: false })), []);
  const ref = useRef<HTMLDivElement>(null);
  useDialog(state.open, ref, close);

  return (
    <EnquiryContext.Provider value={{ open }}>
      {children}
      <div
        className={`mask${state.open ? " is-open" : ""}`}
        onClick={(e) => e.target === e.currentTarget && close()}
        inert={!state.open}
      >
        <div
          ref={ref}
          className="modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="enq-title"
          data-lenis-prevent
        >
          <button type="button" className="pill pill-sm modal-close" onClick={close}>
            Close
          </button>
          <span className="eyebrow">Enquiry</span>
          <h2 id="enq-title" className="disp disp-sm" style={{ margin: "6px 0 6px" }}>
            Ask us anything
          </h2>
          <p style={{ margin: "0 0 18px", color: "var(--text-soft)", fontSize: 15 }}>
            We reply within one working day. Nothing is charged or reserved here.
          </p>
          {state.n > 0 ? (
            <EnquiryForm key={state.n} interest={state.interest} onClose={close} />
          ) : null}
        </div>
      </div>
    </EnquiryContext.Provider>
  );
}

export const useEnquiry = () => useContext(EnquiryContext);

type ButtonProps = {
  interest?: Interest;
  className?: string;
  children?: ReactNode;
  wave?: boolean;
};

/**
 * Opens the enquiry modal with the item pre-filled. Without JavaScript it is a
 * plain link to /contact, where the inline form works as a normal form post.
 */
export function EnquireButton({
  interest,
  className = "pill pill-solid",
  children = "Enquire",
  wave,
}: ButtonProps) {
  const { open } = useEnquiry();
  return (
    <a
      href="/contact#enquire"
      role="button"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        open(interest);
      }}
    >
      {children}
      {wave ? <Wave /> : null}
    </a>
  );
}
