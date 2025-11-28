import { getActivityContent } from "@/app/data/course/get-activity-content";
import { ActivityContent } from "./_components/ActivityContent";

type Params = Promise<{ slug: string; lessonId: string; activityId: string }>;

export default async function ActivityPage({ params }: { params: Params }) {
  const { slug, lessonId, activityId } = await params;
  const data = await getActivityContent(activityId);

  return <ActivityContent data={data} slug={slug} lessonId={lessonId} />;
}