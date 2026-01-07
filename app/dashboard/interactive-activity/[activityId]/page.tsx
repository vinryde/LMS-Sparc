import { getInteractiveActivity } from "@/app/data/course/get-interactive-activity";
import { PDFViewer } from "./_components/PDFViewer";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ activityId: string }>;
}

export default async function InteractiveActivityPage({ params }: PageProps) {
  const { activityId } = await params;
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