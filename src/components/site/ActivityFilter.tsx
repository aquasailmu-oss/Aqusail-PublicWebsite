"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Children, isValidElement, type ReactNode } from "react";
import { RevealGroup } from "@/components/motion";

type Props = {
  types: { value: string; label: string; count: number }[];
  /** Server-rendered cards, each wrapped in an element with data-type. */
  children: ReactNode;
};

/**
 * Client-side filter over the already-loaded list — no round-trip for nine
 * items. The chip lives in the URL as ?type= so a filtered view can be shared.
 * Without JavaScript every card shows and the chips are plain links.
 */
export function ActivityFilter({ types, children }: Props) {
  const params = useSearchParams();
  const router = useRouter();
  const active = params.get("type") ?? "all";
  const total = types.reduce((n, t) => n + t.count, 0);

  const items = Children.toArray(children).filter(
    (c) =>
      active === "all" ||
      (isValidElement<{ "data-type"?: string }>(c) && c.props["data-type"] === active),
  );

  const chip = (value: string, label: string, count: number) => (
    <a
      key={value}
      href={value === "all" ? "/activities" : `/activities?type=${value}`}
      className="chip"
      aria-current={active === value ? "true" : undefined}
      onClick={(e) => {
        e.preventDefault();
        router.replace(value === "all" ? "/activities" : `/activities?type=${value}`, {
          scroll: false,
        });
      }}
    >
      {label}
      <span className="count">{count}</span>
    </a>
  );

  return (
    <>
      <nav className="chips" aria-label="Filter by type">
        {chip("all", "All", total)}
        {types.map((t) => chip(t.value, t.label, t.count))}
      </nav>
      <RevealGroup key={active} className="card-grid" selector=".acard">
        {items}
      </RevealGroup>
    </>
  );
}
