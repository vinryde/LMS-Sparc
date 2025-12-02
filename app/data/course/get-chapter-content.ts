import "server-only";
import { requireUser } from "../user/require-user";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { isEnrollmentExpired } from "@/lib/check-enrollment-expiration";

export async function getChapterContent(chapterId: string) {
  const session = await requireUser();

  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    select: {
      id: true,
      title: true,
      position: true,
      description: true,
      thumbnailKey: true,
      videoKey: true,
      course: {
        select: {
          id: true,
          slug: true,
          title: true,
        },
      },
      lesson: {
        orderBy: { position: "asc" },
        select: {
          id: true,
          title: true,
          position: true,
        },
      },
    },
  });

  if (!chapter) {
    return notFound();
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: chapter.course.id,
      },
    },
    select: { status: true },
  });

  if (!enrollment || enrollment.status !== "Completed") {
    return notFound();
  }

  const expired = await isEnrollmentExpired(session.user.id, chapter.course.id);
  if (expired) {
    redirect(`/course-expired?courseId=${chapter.course.id}`);
  }

  return chapter;
}

export type ChapterContentType = Awaited<ReturnType<typeof getChapterContent>>;