import "server-only";
import { requireUser } from "../user/require-user";
import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { isEnrollmentExpired } from "@/lib/check-enrollment-expiration";

export async function getInteractiveActivity(activityId: string) {
  const session = await requireUser();
  const activity = await prisma.interactiveActivity.findUnique({
    where: {
      id: activityId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      documentKey: true,
      resources: {
        orderBy: {
          position: "asc",
        },
        select: {
          id: true,
          title: true,
          type: true,
          textContent: true,
          linkUrl: true,
          imageKey: true,
          documentKey: true,
        },
      },
      lesson: {
        select: {
          id: true,
          chapter: {
            select: {
              courseId: true,
              course: {
                select: {
                  slug: true,
                }
              }
            },
          },
        },
      },
    },
  });

  if (!activity) {
    return notFound();
  }

  const courseId = activity.lesson.chapter.courseId;

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: courseId,
      },
    },
    select: {
      status: true,
    },
  });

  // Allowing Active or Completed status
  if (!enrollment || (enrollment.status !== "Completed" && enrollment.status !== "Active")) {
    return notFound();
  }

  // Check if enrollment has expired
  const expired = await isEnrollmentExpired(session.user.id, courseId);
  if (expired) {
    redirect(`/course-expired?courseId=${courseId}`);
  }

  return activity;
}