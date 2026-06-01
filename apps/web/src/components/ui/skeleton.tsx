import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-ptr bg-ptr-surface/80",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
