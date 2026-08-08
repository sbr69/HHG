import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Reveals children on first scroll into view. IntersectionObserver, no library. */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "header" | "footer";
}) {
  const ref = useRef<HTMLElement | null>(null);
  // Default to shown=true so text renders immediately on initial paint without waiting for JS observer.
  const [shown, setShown] = useState(true);
  const [immediate, setImmediate] = useState(true);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }

    const rect = el.getBoundingClientRect();
    const inView = rect.top < (window.innerHeight || 800) && rect.bottom > 0;
    if (inView) {
      setImmediate(true);
      setShown(true);
      return;
    }

    setImmediate(false);
    setShown(false);

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Above the fold: fade in fast with a light stagger. Below: the fuller reveal.
  const duration = immediate ? 450 : 900;
  const wait = immediate ? Math.min(delay, 160) : delay;

  return (
    <Tag
      ref={ref as never}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translateY(${immediate ? 10 : 24}px)`,
        transition: `opacity ${duration}ms var(--ease-out-quint) ${wait}ms, transform ${duration}ms var(--ease-out-quint) ${wait}ms`,
      }}
    >
      {children}
    </Tag>
  );
}
