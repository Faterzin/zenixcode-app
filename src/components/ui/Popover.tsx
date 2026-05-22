import { useEffect, useRef, type ReactNode } from "react";

type PopoverProps = {
  open: boolean;
  onClose: () => void;
  anchor: "left" | "right";
  className?: string;
  children: ReactNode;
};

export function Popover({ open, onClose, anchor, className = "", children }: PopoverProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (!ref.current) return;
      if (ref.current.contains(e.target as Node)) return;
      onClose();
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("mousedown", handle);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("mousedown", handle);
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className={`absolute top-full mt-2 ${
        anchor === "left" ? "left-0" : "right-0"
      } z-50 min-w-[240px] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] shadow-[var(--shadow-lg)] origin-top-${anchor} animate-pop-in ${className}`}
      style={{ animation: "popover-in 140ms cubic-bezier(.16,1,.3,1)" }}
    >
      {children}
      <style>{`
        @keyframes popover-in {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
