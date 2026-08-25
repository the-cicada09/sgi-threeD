"use client";

import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

/** "Aircraft / Embraer / ERJ-135" wayfinding trail — the last item is always
 *  plain text (it's where the user already is), earlier ones are a Link if
 *  `href` is given or a click handler otherwise (e.g. jump the manufacturer
 *  nav open without leaving the page). */
export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400"
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={item.label} className="flex items-center gap-1.5">
            {i > 0 && (
              <span aria-hidden className="text-zinc-300 dark:text-zinc-700">
                /
              </span>
            )}
            {isLast ? (
              <span aria-current="page" className="text-zinc-700 dark:text-zinc-300">
                {item.label}
              </span>
            ) : item.href ? (
              <Link
                href={item.href}
                className="transition hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                {item.label}
              </Link>
            ) : (
              <button
                type="button"
                onClick={item.onClick}
                className="cursor-pointer transition hover:text-zinc-900 dark:hover:text-zinc-100"
              >
                {item.label}
              </button>
            )}
          </span>
        );
      })}
    </nav>
  );
}
