import type { ReactNode } from "react";

export function ChartCard({
  title,
  subtitle,
  action,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-black/8 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900 ${className ?? ""}`}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">{title}</h3>
          {subtitle && (
            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
