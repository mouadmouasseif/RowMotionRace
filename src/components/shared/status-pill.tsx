import { CircleCheck, CircleX, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatusPill({
  status,
  children
}: {
  status: "success" | "warning" | "loading";
  children: React.ReactNode;
}) {
  const Icon = status === "success" ? CircleCheck : status === "loading" ? LoaderCircle : CircleX;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium",
        status === "success" && "border-race-success/20 bg-race-success/10 text-race-success",
        status === "warning" && "border-race-warning/20 bg-race-warning/10 text-race-warning",
        status === "loading" && "border-race-primary/20 bg-race-primary/10 text-race-primary"
      )}
    >
      <Icon className={cn("size-3.5", status === "loading" && "animate-spin")} />
      {children}
    </span>
  );
}
