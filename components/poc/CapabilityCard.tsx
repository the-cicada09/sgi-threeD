"use client";

import type { ReactNode } from "react";
import { useInView } from "./useInView";

export function CapabilityCard({
  title,
  description,
  children,
  lazy = true,
  className,
}: {
  title: string;
  description: string;
  children: ReactNode;
  /** Skip the scroll-into-view gate for cards with no WebGL canvas to defer. */
  lazy?: boolean;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const show = !lazy || inView;

  return (
    <div
      ref={ref}
      className={`rounded-2xl border border-black/8 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900 ${className ?? ""}`}
    >
      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">{title}</h2>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
      <div className="mt-4">
        {show ? (
          children
        ) : (
          <div className="flex h-72 w-full items-center justify-center rounded-xl bg-zinc-100 text-xs text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
            Scroll to load the 3D preview…
          </div>
        )}
      </div>
    </div>
  );
}
