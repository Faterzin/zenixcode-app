type AvatarProps = {
  initials: string;
  color?: string;
  size?: "sm" | "md" | "lg";
};

const SIZES: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "w-6 h-6 text-[10px]",
  md: "w-8 h-8 text-xs",
  lg: "w-10 h-10 text-sm",
};

export function Avatar({ initials, color, size = "md" }: AvatarProps) {
  return (
    <div
      className={`${SIZES[size]} rounded-lg flex items-center justify-center font-semibold tracking-wide text-white shadow-sm shrink-0`}
      style={{
        background: color
          ? `linear-gradient(135deg, ${color}, color-mix(in srgb, ${color} 60%, #000))`
          : "linear-gradient(135deg, var(--color-brand), var(--color-brand-active))",
      }}
    >
      {initials}
    </div>
  );
}
