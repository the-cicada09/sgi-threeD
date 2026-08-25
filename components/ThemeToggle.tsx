"use client";

const STORAGE_KEY = "theme";

function SunIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8 1v1.6M8 13.4V15M15 8h-1.6M2.6 8H1M12.9 3.1l-1.1 1.1M4.2 11.7l-1.1 1.1M12.9 12.9l-1.1-1.1M4.2 4.2 3.1 3.1"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
      <path
        d="M13.8 9.9A6 6 0 1 1 6.1 2.2a5 5 0 0 0 7.7 7.7Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Sun/moon toggle for the site's light/dark theme — flips the `.dark` class
 * on <html> (see globals.css's `dark:` custom variant and every `dark:`
 * utility already used throughout this page) and remembers the choice in
 * localStorage. The inline script in app/layout.tsx sets that class before
 * hydration, so there's no flash of the wrong theme.
 *
 * Deliberately has no React state of its own for "which theme is active" —
 * reading that from `document` on mount would either mismatch the server
 * render (crash/warn) or require a setState-in-effect (flagged by the
 * react-hooks/set-state-in-effect rule, and a real extra render besides).
 * Both icons render unconditionally and simple `dark:` CSS classes pick
 * which one shows, so the swap is instant, hydration-safe, and needs no
 * client-only branching at all.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const toggle = () => {
    const next = document.documentElement.classList.contains("dark") ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private browsing / storage disabled — theme still applies, it just
      // won't be remembered on the next visit.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle color theme"
      title="Toggle color theme"
      className={`flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md border border-black/10 text-zinc-500 transition-colors duration-150 hover:bg-zinc-50 hover:text-zinc-900 dark:border-white/10 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-50 ${className ?? ""}`}
    >
      <span className="dark:hidden">
        <SunIcon />
      </span>
      <span className="hidden dark:block">
        <MoonIcon />
      </span>
    </button>
  );
}
