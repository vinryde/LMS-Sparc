import { getInteractiveActivity } from "@/app/data/course/get-interactive-activity";
import { PDFViewer } from "./_components/PDFViewer";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ activityId: string }>;
}

export default async function InteractiveActivityPage({ params }: PageProps) {
  const { activityId } = await params;

  return (
    <Suspense fallback={<InteractiveActivitySkeleton />}>
      <RenderInteractiveActivity activityId={activityId} />
    </Suspense>
  );
}

async function RenderInteractiveActivity({ activityId }: { activityId: string }) {
  const activity = await getInteractiveActivity(activityId);

  if (!activity) {
    return notFound();
  }

  const lessonId = activity.lesson.id;
  const slug = activity.lesson.chapter.course.slug;
  const backLink = `/dashboard/${slug}/${lessonId}`;

  return (
    <PDFViewer
      documentKey={activity.documentKey}
      title={activity.title}
      description={activity.description}
      backLink={backLink}
    />
  );
}

function InteractiveActivitySkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-background pl-6 pr-6 pb-6">
      {/* Back Button Area */}
      <div className="py-4 shrink-0">
        <Button variant="outline" disabled>
          <ArrowLeft className="size-4 mr-2" />
          Back to Lesson
        </Button>
      </div>

      {/* Header Area */}
      <div className="space-y-3 pt-3 mb-6 shrink-0">
        <div className="flex items-center gap-3">
           <Skeleton className="size-8 rounded-none" />
           <Skeleton className="h-10 w-1/3" />
        </div>
        <Skeleton className="h-6 w-2/3" />
      </div>

      {/* Zoom Controls Skeleton */}
      <div className="mb-4 flex items-center gap-2 shrink-0">
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-9 w-9" />
      </div>

      {/* PDF Viewer Area Skeleton */}
      <Skeleton className="flex-1 w-full rounded-lg" />
    </div>
  );
}