import { adminGetChapter } from "@/app/data/admin/admin-get-chapter";
import { ChapterForm } from "./_components/ChapterForm";

type Params = Promise<{
  courseId: string;
  chapterId: string;
}>;

export default async function ChapterIdPage({ params }: { params: Params }) {
  const { chapterId, courseId } = await params;
  const chapter = await adminGetChapter(chapterId);
  return <ChapterForm data={chapter} courseId={courseId} />;
}