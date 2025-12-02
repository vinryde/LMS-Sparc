export function ChapterSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <div className="aspect-video rounded-lg bg-muted animate-pulse" />
      <div className="h-8 w-1/2 rounded bg-muted animate-pulse" />
      <div className="h-4 w-5/6 rounded bg-muted animate-pulse" />
      <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
    </div>
  );
}