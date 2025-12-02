import { Suspense } from "react";
import { getChapterContent } from "@/app/data/course/get-chapter-content";
import { ChapterContent } from "./_components/ChapterContent";
import { ChapterSkeleton } from "./_components/ChapterSkeleton";

type Params = Promise<{ chapterId: string }>;

export default async function ChapterPage({ params }: { params: Params }) {
  const { chapterId } = await params;
  return (
    <Suspense fallback={<ChapterSkeleton />}>
      <ChapterContentLoader chapterId={chapterId} />
    </Suspense>
  );
}

async function ChapterContentLoader({ chapterId }: { chapterId: string }) {
  const data = await getChapterContent(chapterId);
  return <ChapterContent data={data} />;
}