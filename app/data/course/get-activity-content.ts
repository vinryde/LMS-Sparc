import "server-only";
import { requireUser } from "../user/require-user";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { isEnrollmentExpired } from "@/lib/check-enrollment-expiration";

export async function getActivityContent(activityId: string) {
  const session = await requireUser();

  const activity = await prisma.activity.findUnique({
    where: { id: activityId },
    select: {
      id: true,
      title: true,
      description: true,
      position: true,
      resources: {
        orderBy: { position: "asc" },
        select: {
          id: true,
          title: true,
          type: true,
          position: true,
          textContent: true,
          linkUrl: true,
          imageKey: true,
          documentKey: true,
        },
      },
      lesson: {
        select: {
          id: true,
          title: true,
          chapter: {
            select: {
              courseId: true,
              course: {
                select: { slug: true },
              },
            },
          },
        },
      },
    },
  });

  if (!activity) {
    return notFound();
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: activity.lesson.chapter.courseId,
      },
    },
    select: { status: true },
  });

  if (!enrollment || enrollment.status !== "Completed") {
    return notFound();
  }

  const expired = await isEnrollmentExpired(session.user.id, activity.lesson.chapter.courseId);
  if (expired) {
    redirect(`/course-expired?courseId=${activity.lesson.chapter.courseId}`);
  }

  return activity;
}

export type ActivityContentType = Awaited<ReturnType<typeof getActivityContent>>;