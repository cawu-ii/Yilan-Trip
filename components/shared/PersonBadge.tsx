import { colorClasses } from "@/lib/colors";

export function PersonBadge({
  name,
  color,
  size = "sm",
}: {
  name: string;
  color: string;
  size?: "sm" | "md";
}) {
  const c = colorClasses(color);
  const sizeClasses =
    size === "sm" ? "text-xs px-2 py-0.5 gap-1" : "text-sm px-3 py-1 gap-1.5";
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${c.soft} ${c.ink} ${sizeClasses}`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${c.dot}`} />
      {name}
    </span>
  );
}
